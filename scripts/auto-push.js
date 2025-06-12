const { exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

// Configuration
const WATCH_PATHS = [
  'app/**/*',
  'components/**/*',
  'lib/**/*',
  'pages/**/*',
  'public/**/*',
  'styles/**/*',
  'types/**/*',
  'middleware/**/*',
  'services/**/*',
  'hooks/**/*',
  'models/**/*',
  'prisma/**/*',
  'docs/**/*',
  'scripts/**/*',
  'cypress/**/*',
  '*.js',
  '*.ts',
  '*.tsx',
  '*.jsx',
  '*.json',
  '*.md',
  '*.css',
  '*.scss'
];

// Ignore paths
const IGNORE_PATHS = [
  'node_modules/**',
  '.next/**',
  '.git/**',
  'coverage/**',
  'cypress/videos/**',
  'cypress/screenshots/**',
  '*.log',
  '*.lock'
];

// Debounce function to prevent multiple pushes
let pushTimeout;
const DEBOUNCE_DELAY = 2000; // Reduced from 5 seconds to 2 seconds for faster pushes

// Track if a push is in progress
let isPushInProgress = false;
let pendingChanges = false;

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        console.error(`Command stderr: ${stderr}`);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function pushChanges() {
  if (isPushInProgress) {
    pendingChanges = true;
    return;
  }
  
  try {
    isPushInProgress = true;
    console.log('🔄 Changes detected, pushing to GitHub...');
    
    // Get current timestamp for commit message
    const timestamp = new Date().toISOString();
    
    // Check git status first
    const status = await executeCommand('git status --porcelain');
    
    if (!status.trim()) {
      console.log('✓ No changes to commit');
      isPushInProgress = false;
      return;
    }
    
    // Add all changes
    await executeCommand('git add .');
    
    // Commit changes
    await executeCommand(`git commit -m "Auto-push: ${timestamp} [EHB AI Agent]"`);
    
    // Push to remote
    await executeCommand('git push');
    
    console.log('✅ Changes pushed successfully at ' + new Date().toLocaleTimeString());
  } catch (error) {
    console.error('❌ Error pushing changes:', error);
    
    // Try to recover from common git errors
    try {
      if (error.message && error.message.includes('not a git repository')) {
        console.log('🔄 Initializing git repository...');
        await executeCommand('git init');
        await executeCommand('git add .');
        await executeCommand(`git commit -m "Initial commit"`);
        console.log('✅ Git repository initialized');
      } else if (error.message && error.message.includes('remote origin already exists')) {
        // Skip this error, it's fine
      }
    } catch (recoveryError) {
      console.error('❌ Recovery failed:', recoveryError);
    }
  } finally {
    isPushInProgress = false;
    
    // If changes were made while we were pushing, push again
    if (pendingChanges) {
      pendingChanges = false;
      setTimeout(pushChanges, 1000);
    }
  }
}

// Initialize watcher
const watcher = chokidar.watch(WATCH_PATHS, {
  ignored: IGNORE_PATHS,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  }
});

// Handle file changes
watcher.on('change', (filePath) => {
  console.log(`📝 File changed: ${filePath} at ${new Date().toLocaleTimeString()}`);
  
  // Clear existing timeout
  if (pushTimeout) {
    clearTimeout(pushTimeout);
  }
  
  // Set new timeout
  pushTimeout = setTimeout(() => {
    pushChanges();
  }, DEBOUNCE_DELAY);
});

// Also watch for new files
watcher.on('add', (filePath) => {
  console.log(`➕ New file added: ${filePath}`);
  
  // Clear existing timeout
  if (pushTimeout) {
    clearTimeout(pushTimeout);
  }
  
  // Set new timeout
  pushTimeout = setTimeout(() => {
    pushChanges();
  }, DEBOUNCE_DELAY);
});

// Handle errors
watcher.on('error', (error) => {
  console.error(`❌ Watcher error: ${error}`);
});

console.log('🚀 Auto-push system initialized!');
console.log(`⏱️ Auto-push delay set to ${DEBOUNCE_DELAY/1000} seconds`);
console.log('👀 Watching for changes...');

// Initial push to verify everything is working
setTimeout(() => {
  console.log('🔍 Checking for initial changes to push...');
  pushChanges();
}, 3000); 