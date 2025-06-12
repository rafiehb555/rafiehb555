import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * GitService - Manages git operations for the EHB AI Agent
 * Provides methods for pushing changes, checking status, and managing repositories
 */
export class GitService {
  private static instance: GitService;
  private isOperationInProgress: boolean = false;
  private config: {
    autoPush: boolean;
    branch: string;
    commitPrefix: string;
  };

  private constructor() {
    this.config = {
      autoPush: true,
      branch: 'main',
      commitPrefix: '[EHB AI Agent]'
    };

    // Try to load config from file
    try {
      const configPath = path.join(process.cwd(), 'app', 'config', 'cursor-deploy-config.json');
      if (fs.existsSync(configPath)) {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (configData.github) {
          this.config.autoPush = configData.github.autoPush ?? true;
          this.config.branch = configData.github.branch ?? 'main';
        }
      }
    } catch (error) {
      console.error('Error loading git config:', error);
    }
  }

  static getInstance(): GitService {
    if (!GitService.instance) {
      GitService.instance = new GitService();
    }
    return GitService.instance;
  }

  /**
   * Execute a git command and return the result
   */
  private async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Git command error: ${error.message}`);
          console.error(`stderr: ${stderr}`);
          reject(error);
          return;
        }
        resolve(stdout.trim());
      });
    });
  }

  /**
   * Get the current git status
   */
  async getStatus(): Promise<string> {
    try {
      return await this.executeCommand('git status --porcelain');
    } catch (error) {
      console.error('Failed to get git status:', error);
      return '';
    }
  }

  /**
   * Check if there are any changes to commit
   */
  async hasChanges(): Promise<boolean> {
    const status = await this.getStatus();
    return status.length > 0;
  }

  /**
   * Commit and push changes with a message
   */
  async commitAndPush(message: string): Promise<boolean> {
    if (this.isOperationInProgress) {
      console.log('Git operation already in progress, queueing...');
      // Wait and try again
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await this.commitAndPush(message));
        }, 2000);
      });
    }

    this.isOperationInProgress = true;
    try {
      const hasChanges = await this.hasChanges();
      if (!hasChanges) {
        console.log('No changes to commit');
        return true;
      }

      const timestamp = new Date().toISOString();
      const fullMessage = `${this.config.commitPrefix}: ${message} [${timestamp}]`;

      await this.executeCommand('git add .');
      await this.executeCommand(`git commit -m "${fullMessage}"`);
      
      if (this.config.autoPush) {
        await this.executeCommand(`git push origin ${this.config.branch}`);
        console.log(`✅ Changes pushed to ${this.config.branch} at ${new Date().toLocaleTimeString()}`);
      } else {
        console.log(`✅ Changes committed locally at ${new Date().toLocaleTimeString()}`);
      }
      
      return true;
    } catch (error) {
      console.error('Git operation failed:', error);
      return false;
    } finally {
      this.isOperationInProgress = false;
    }
  }

  /**
   * Force push changes to the remote repository
   */
  async forcePush(): Promise<boolean> {
    try {
      await this.executeCommand(`git push -f origin ${this.config.branch}`);
      return true;
    } catch (error) {
      console.error('Force push failed:', error);
      return false;
    }
  }

  /**
   * Initialize a git repository if it doesn't exist
   */
  async initializeRepository(): Promise<boolean> {
    try {
      await this.executeCommand('git init');
      await this.executeCommand('git add .');
      await this.executeCommand('git commit -m "Initial commit by EHB AI Agent"');
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
   * Get the current branch
   */
  async getCurrentBranch(): Promise<string> {
    try {
      return await this.executeCommand('git rev-parse --abbrev-ref HEAD');
    } catch (error) {
      console.error('Failed to get current branch:', error);
      return this.config.branch;
    }
  }
} 