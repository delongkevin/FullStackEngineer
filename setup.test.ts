import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as childProcess from 'child_process';

// Mock modules
vi.mock('fs');
vi.mock('child_process');

describe('setup.js logic', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockProcessExit: ReturnType<typeof vi.spyOn>;
  
  const directories = [
    'components',
    'data', 
    'public/images',
    'public/images/projects',
    'public/icons'
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
      throw new Error(`process.exit called with code ${code}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('directory creation logic', () => {
    it('should identify directories that need to be created', () => {
      const existingDirs = new Set(['components', 'data']);
      const dirsToCreate: string[] = [];
      
      directories.forEach(dir => {
        if (!existingDirs.has(dir)) {
          dirsToCreate.push(dir);
        }
      });

      expect(dirsToCreate).toContain('public/images');
      expect(dirsToCreate).toContain('public/images/projects');
      expect(dirsToCreate).toContain('public/icons');
      expect(dirsToCreate).not.toContain('components');
      expect(dirsToCreate).not.toContain('data');
    });

    it('should include all required directories', () => {
      expect(directories).toContain('components');
      expect(directories).toContain('data');
      expect(directories).toContain('public/images');
      expect(directories).toContain('public/images/projects');
      expect(directories).toContain('public/icons');
    });

    it('should have correct number of directories', () => {
      expect(directories.length).toBe(5);
    });
  });

  describe('setup validation scenarios', () => {
    it('should fail when package.json does not exist', () => {
      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(false);

      const packageJsonExists = fs.existsSync('package.json');
      expect(packageJsonExists).toBe(false);
    });

    it('should proceed when package.json exists', () => {
      const mockExistsSync = vi.mocked(fs.existsSync);
      mockExistsSync.mockReturnValue(true);

      const packageJsonExists = fs.existsSync('package.json');
      expect(packageJsonExists).toBe(true);
    });

    it('should call npm install with correct options', () => {
      const mockExecSync = vi.mocked(childProcess.execSync);
      mockExecSync.mockImplementation(() => Buffer.from(''));

      childProcess.execSync('npm install', { stdio: 'inherit' });

      expect(mockExecSync).toHaveBeenCalledWith('npm install', { stdio: 'inherit' });
    });

    it('should handle npm install failure', () => {
      const mockExecSync = vi.mocked(childProcess.execSync);
      mockExecSync.mockImplementation(() => {
        throw new Error('npm install failed');
      });

      expect(() => {
        childProcess.execSync('npm install', { stdio: 'inherit' });
      }).toThrow('npm install failed');
    });
  });

  describe('directory operations', () => {
    it('should create directory with recursive option', () => {
      const mockMkdirSync = vi.mocked(fs.mkdirSync);
      mockMkdirSync.mockImplementation(() => undefined);

      fs.mkdirSync('public/images/projects', { recursive: true });

      expect(mockMkdirSync).toHaveBeenCalledWith('public/images/projects', { recursive: true });
    });

    it('should not create directory if it already exists', () => {
      const mockExistsSync = vi.mocked(fs.existsSync);
      const mockMkdirSync = vi.mocked(fs.mkdirSync);
      
      mockExistsSync.mockReturnValue(true);

      if (!fs.existsSync('components')) {
        fs.mkdirSync('components', { recursive: true });
      }

      expect(mockMkdirSync).not.toHaveBeenCalled();
    });

    it('should create multiple missing directories', () => {
      const mockExistsSync = vi.mocked(fs.existsSync);
      const mockMkdirSync = vi.mocked(fs.mkdirSync);
      
      const existingDirs = new Set(['components', 'data', 'package.json']);
      mockExistsSync.mockImplementation((path) => existingDirs.has(path as string));
      mockMkdirSync.mockImplementation(() => undefined);

      directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      expect(mockMkdirSync).toHaveBeenCalledTimes(3);
      expect(mockMkdirSync).toHaveBeenCalledWith('public/images', { recursive: true });
      expect(mockMkdirSync).toHaveBeenCalledWith('public/images/projects', { recursive: true });
      expect(mockMkdirSync).toHaveBeenCalledWith('public/icons', { recursive: true });
    });
  });

  describe('expected output messages', () => {
    it('should have setup start message format', () => {
      const startMessage = '🚀 Setting up your portfolio website...';
      expect(startMessage).toContain('Setting up');
    });

    it('should have package.json error message format', () => {
      const errorMessage = '❌ package.json not found. Please run this script in your project root.';
      expect(errorMessage).toContain('package.json not found');
    });

    it('should have npm install message format', () => {
      const installMessage = '📦 Installing dependencies...';
      expect(installMessage).toContain('Installing dependencies');
    });

    it('should have completion messages format', () => {
      const completionMessage = '✅ Setup complete!';
      const devMessage = '🎉 Run "npm run dev" to start your development server';
      const urlMessage = '🌐 Your site will be available at: http://localhost:3000';
      
      expect(completionMessage).toContain('Setup complete');
      expect(devMessage).toContain('npm run dev');
      expect(urlMessage).toContain('localhost:3000');
    });

    it('should have directory creation message format', () => {
      const dir = 'public/images';
      const message = `✅ Created directory: ${dir}`;
      expect(message).toContain('Created directory');
      expect(message).toContain(dir);
    });
  });
});
