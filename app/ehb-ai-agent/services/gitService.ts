import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * GitService - Manages git operations for the EHB AI Agent
 * Ultra-fast implementation with optimized performance
 */
export class GitService {
  private static instance: GitService;
  private isOperationInProgress: boolean = false;
  private config: {
    autoPush: boolean;
    branch: string;
    commitPrefix: string;
    maxBuffer: number;
    useNoVerify: boolean;
    useAtomicPush: boolean;
    fastMode: boolean;
  };
  private isServer: boolean;
  private lastOperationTime: number = 0;
  private operationQueue: Array<() => Promise<boolean>> = [];
  private cpuCount: number;

  private constructor() {
    this.isServer = typeof window === 'undefined';
    this.cpuCount = os.cpus().length;
    
    this.config = {
      autoPush: true,
      branch: 'main',
      commitPrefix: '⚡[EHB AI Agent]',
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large repos
      useNoVerify: true,           // Skip git hooks for speed
      useAtomicPush: true,         // Use atomic push for reliability
      fastMode: true               // Enable all performance optimizations
    };

    // Try to load config from file (server-side only)
    if (this.isServer) {
      try {
        const configPath = path.join(process.cwd(), 'app', 'config', 'cursor-deploy-config.json');
        if (fs.existsSync(configPath)) {
          const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (configData.github) {
            this.config.autoPush = configData.github.autoPush ?? true;
            this.config.branch = configData.github.branch ?? 'main';
            this.config.fastMode = configData.github.fastMode ?? true;
          }
        }
      } catch (error) {
        console.error('Error loading git config:', error);
      }
    }
    
    console.log(`🚀 GitService initialized in ${this.config.fastMode ? 'ULTRA-FAST' : 'normal'} mode`);
    if (this.config.fastMode) {
      console.log(`⚡ Performance optimizations: ${this.cpuCount} cores, ${this.config.useNoVerify ? 'hooks disabled' : 'hooks enabled'}, ${this.config.useAtomicPush ? 'atomic push' : 'standard push'}`);
    }
  }

  static getInstance(): GitService {
    if (!GitService.instance) {
      GitService.instance = new GitService();
    }
    return GitService.instance;
  }

  /**
   * Execute a git command and return the result with performance metrics
   */
  private async executeCommand(command: string): Promise<string> {
    if (!this.isServer) {
      console.log('Git commands can only be executed on the server');
      return '';
    }
    
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      exec(command, { maxBuffer: this.config.maxBuffer }, (error, stdout, stderr) => {
        const execTime = Date.now() - startTime;
        
        if (error) {
          console.error(`❌ Git command failed (${execTime}ms): ${command}`);
          console.error(`Error: ${error.message}`);
          if (stderr) console.error(`stderr: ${stderr}`);
          reject(error);
          return;
        }
        
        if (execTime > 1000) {
          console.log(`⏱️ Git command took ${execTime}ms: ${command.slice(0, 50)}${command.length > 50 ? '...' : ''}`);
        }
        
        this.lastOperationTime = Date.now();
        resolve(stdout.trim());
      });
    });
  }

  /**
   * Get the current git status with optimized flags
   */
  async getStatus(): Promise<string> {
    if (!this.isServer) {
      return '';
    }
    
    try {
      // Use --untracked-files=no for faster status on large repos
      return await this.executeCommand('git status --porcelain --untracked-files=no');
    } catch (error) {
      console.error('Failed to get git status:', error);
      return '';
    }
  }

  /**
   * Check if there are any changes to commit (optimized)
   */
  async hasChanges(): Promise<boolean> {
    if (!this.isServer) {
      return false;
    }
    
    try {
      // Faster check that doesn't need full status
      const output = await this.executeCommand('git diff-index --quiet HEAD || echo "changed"');
      return output.includes('changed');
    } catch (error) {
      // If error occurs (e.g., no commits yet), assume changes exist
      return true;
    }
  }

  /**
   * Commit and push changes with a message (ultra-fast implementation)
   */
  async commitAndPush(message: string): Promise<boolean> {
    if (!this.isServer) {
      console.log('Git operations can only be performed on the server');
      return false;
    }
    
    if (this.isOperationInProgress) {
      console.log('⏱️ Git operation already in progress, queueing...');
      // Queue the operation with immediate execution when possible
      return new Promise(resolve => {
        this.operationQueue.push(async () => {
          const result = await this.commitAndPush(message);
          resolve(result);
          return result;
        });
      });
    }

    this.isOperationInProgress = true;
    const startTime = Date.now();
    
    try {
      // Fast check for changes
      const hasChanges = await this.hasChanges();
      if (!hasChanges) {
        console.log('✓ No changes to commit');
        return true;
      }

      const timestamp = new Date().toISOString();
      const fullMessage = `${this.config.commitPrefix}: ${message} [${timestamp}]`;

      // Optimized git add with custom flags
      await this.executeCommand('git add -A');
      
      // Commit with optimized flags
      const commitFlags = this.config.useNoVerify ? ' --no-verify' : '';
      await this.executeCommand(`git commit -m "${fullMessage}"${commitFlags}`);
      
      if (this.config.autoPush) {
        try {
          // Push with optimized flags
          const pushFlags = [];
          if (this.config.useNoVerify) pushFlags.push('--no-verify');
          if (this.config.useAtomicPush) pushFlags.push('--atomic');
          
          const pushCmd = `git push origin ${this.config.branch}${pushFlags.length ? ' ' + pushFlags.join(' ') : ''}`;
          await this.executeCommand(pushCmd);
        } catch (error: any) {
          // Advanced error handling
          if (error.message && typeof error.message === 'string') {
            if (error.message.includes('no upstream branch')) {
              console.log(`🔄 Setting upstream branch for ${this.config.branch}...`);
              const setupCmd = `git push --set-upstream origin ${this.config.branch}${this.config.useNoVerify ? ' --no-verify' : ''}`;
              await this.executeCommand(setupCmd);
            } else if (error.message.includes('failed to push some refs')) {
              // Try pull and rebase strategy
              console.log('🔄 Pull before push strategy...');
              await this.executeCommand('git pull --rebase');
              await this.executeCommand(`git push origin ${this.config.branch}${this.config.useNoVerify ? ' --no-verify' : ''}`);
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        }
        const execTime = Date.now() - startTime;
        console.log(`✅ Changes pushed to ${this.config.branch} at ${new Date().toLocaleTimeString()} (${execTime}ms)`);
      } else {
        console.log(`✅ Changes committed locally at ${new Date().toLocaleTimeString()}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Git operation failed:', error);
      return false;
    } finally {
      this.isOperationInProgress = false;
      
      // Process next operation in queue if any
      if (this.operationQueue.length > 0) {
        const nextOperation = this.operationQueue.shift();
        if (nextOperation) {
          setImmediate(() => nextOperation());
        }
      }
    }
  }

  /**
   * Force push changes to the remote repository (optimized)
   */
  async forcePush(): Promise<boolean> {
    if (!this.isServer) {
      return false;
    }
    
    try {
      const pushFlags = this.config.useNoVerify ? ' --no-verify' : '';
      await this.executeCommand(`git push -f origin ${this.config.branch}${pushFlags}`);
      return true;
    } catch (error) {
      console.error('Force push failed:', error);
      return false;
    }
  }

  /**
   * Initialize a git repository if it doesn't exist (optimized)
   */
  async initializeRepository(): Promise<boolean> {
    if (!this.isServer) {
      return false;
    }
    
    try {
      await this.executeCommand('git init');
      await this.executeCommand('git add -A');
      const commitFlags = this.config.useNoVerify ? ' --no-verify' : '';
      await this.executeCommand(`git commit -m "⚡ Initial commit by EHB AI Agent"${commitFlags}`);
      return true;
    } catch (error) {
      console.error('Failed to initialize repository:', error);
      return false;
    }
  }

  /**
   * Set the auto-push configuration
   */
  setAutoPush(enabled: boolean): void {
    this.config.autoPush = enabled;
    console.log(`Auto-push ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Toggle fast mode for ultra-fast performance
   */
  setFastMode(enabled: boolean): void {
    this.config.fastMode = enabled;
    this.config.useNoVerify = enabled;
    this.config.useAtomicPush = enabled;
    console.log(`Fast mode ${enabled ? 'enabled ⚡' : 'disabled'}`);
  }

  /**
   * Get the current auto-push configuration
   */
  getAutoPushEnabled(): boolean {
    return this.config.autoPush;
  }

  /**
   * Set the branch to push to
   */
  setBranch(branch: string): void {
    this.config.branch = branch;
  }

  /**
   * Get the current branch (optimized)
   */
  async getCurrentBranch(): Promise<string> {
    if (!this.isServer) {
      return this.config.branch;
    }
    
    try {
      // Faster than rev-parse for getting current branch
      return await this.executeCommand('git symbolic-ref --short HEAD');
    } catch (error) {
      console.error('Failed to get current branch:', error);
      return this.config.branch;
    }
  }
} 