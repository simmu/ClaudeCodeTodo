import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Database test utilities
export class TestDatabaseManager {
  private static instance: TestDatabaseManager;
  private isStarted = false;

  private constructor() {}

  static getInstance(): TestDatabaseManager {
    if (!TestDatabaseManager.instance) {
      TestDatabaseManager.instance = new TestDatabaseManager();
    }
    return TestDatabaseManager.instance;
  }

  async startTestDatabase(): Promise<void> {
    if (this.isStarted) {
      return;
    }

    try {
      console.log('Starting test database...');
      
      // Start the test database container
      await execAsync('docker-compose -f docker-compose.test.yml up -d --wait');
      
      // Wait a bit more for the database to be fully ready
      await this.waitForDatabaseReady();
      
      this.isStarted = true;
      console.log('Test database started successfully');
    } catch (error) {
      console.error('Failed to start test database:', error);
      throw error;
    }
  }

  async stopTestDatabase(): Promise<void> {
    if (!this.isStarted) {
      return;
    }

    try {
      console.log('Stopping test database...');
      await execAsync('docker-compose -f docker-compose.test.yml down');
      this.isStarted = false;
      console.log('Test database stopped');
    } catch (error) {
      console.error('Failed to stop test database:', error);
      throw error;
    }
  }

  async cleanTestDatabase(): Promise<void> {
    if (!this.isStarted) {
      await this.startTestDatabase();
    }

    try {
      // This will be implemented when we have Prisma setup
      // For now, we'll use direct SQL commands
      console.log('Cleaning test database...');
      
      // Reset database to clean state
      // Implementation will be added when database schema is ready
    } catch (error) {
      console.error('Failed to clean test database:', error);
      throw error;
    }
  }

  private async waitForDatabaseReady(maxRetries: number = 30): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Check if database is ready by executing a simple query
        await execAsync(
          'docker exec todo-test-db psql -U test_user -d todo_test -c "SELECT 1" > /dev/null 2>&1'
        );
        return; // Database is ready
      } catch (error) {
        if (i === maxRetries - 1) {
          throw new Error('Test database failed to become ready within timeout');
        }
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  getTestDatabaseUrl(): string {
    return 'postgresql://test_user:test_password@localhost:5433/todo_test';
  }

  getTestRedisUrl(): string {
    return 'redis://localhost:6380';
  }
}

// Singleton instance for easy access
export const testDb = TestDatabaseManager.getInstance();

// Helper functions for Jest setup
export const setupTestDatabase = async (): Promise<void> => {
  await testDb.startTestDatabase();
};

export const teardownTestDatabase = async (): Promise<void> => {
  await testDb.stopTestDatabase();
};

export const cleanDatabase = async (): Promise<void> => {
  await testDb.cleanTestDatabase();
};

// Mock database connection for unit tests
export const createMockDatabaseConnection = () => ({
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  query: jest.fn(),
  transaction: jest.fn(),
});

// Database seeding utilities
export interface SeedOptions {
  users?: number;
  todos?: number;
  withConflicts?: boolean;
}

export const seedDatabase = async (options: SeedOptions = {}): Promise<void> => {
  const { users = 2, todos = 10, withConflicts = false } = options;
  
  try {
    console.log(`Seeding database with ${users} users and ${todos} todos...`);
    
    // Implementation will be added when database schema is ready
    // This will create test users and todos for integration testing
    
    if (withConflicts) {
      // Add some todos with conflict scenarios for sync testing
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
};