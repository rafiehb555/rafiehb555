const fs = require('fs');
const path = require('path');

// Create necessary directories with proper permissions
const directories = ['.next', '.next/trace', 'public', 'public/uploads'];

directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
});

// Set proper permissions for .next directory
const nextDir = path.join(process.cwd(), '.next');
try {
  fs.chmodSync(nextDir, '755');
  console.log('Set permissions for .next directory');
} catch (error) {
  console.error('Error setting permissions:', error);
}
