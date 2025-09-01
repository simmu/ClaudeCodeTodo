# Testing Infrastructure

This directory contains the comprehensive testing setup for the Todo App monorepo.

## Overview

The testing infrastructure supports multiple testing levels:
- **Unit Tests**: Individual components, functions, and modules
- **Integration Tests**: API endpoints and service interactions
- **E2E Tests**: Full user workflows and offline scenarios

## Directory Structure

```
tests/
├── unit/
│   ├── frontend/        # React component tests
│   ├── backend/         # Node.js service tests
│   └── shared/          # Type and utility tests
├── integration/
│   ├── api/             # API endpoint tests
│   └── sync/            # Synchronization tests
├── e2e/
│   ├── user-flows/      # User journey tests
│   └── offline-scenarios/ # PWA offline tests
├── fixtures/            # Test data and mocks
│   ├── todos.ts         # Todo mock data
│   ├── users.ts         # User mock data
│   ├── api-responses.ts # API response mocks
│   └── sql/            # Database fixtures
├── utils/
│   ├── test-helpers.ts  # Testing utilities
│   ├── setupTests.ts    # Frontend test setup
│   ├── setupTestsBackend.ts # Backend test setup
│   ├── setupIntegrationTests.ts # Integration test setup
│   ├── database.ts      # Database test utilities
│   ├── globalSetup.ts   # Playwright global setup
│   └── globalTeardown.ts # Playwright global teardown
└── README.md           # This file
```

## Testing Frameworks

### Jest
- **Unit and Integration Tests**: All TypeScript/JavaScript testing
- **Coverage Reports**: Comprehensive code coverage analysis
- **Multi-project Setup**: Separate configurations for frontend, backend, and shared packages

### React Testing Library
- **Component Tests**: User-centric component testing
- **Integration with Jest**: Seamless testing of React components
- **Accessibility Testing**: Built-in accessibility checking

### Playwright
- **E2E Testing**: Full browser automation across multiple browsers
- **Offline Testing**: Service worker and PWA functionality testing
- **Visual Testing**: Screenshot comparison and UI regression testing

## Test Database

### Docker Setup
- **PostgreSQL**: Test database container on port 5433
- **Redis**: Test cache container on port 6380
- **Isolation**: Separate from development database
- **Fixtures**: Pre-seeded test data

### Usage
```bash
# Start test database
npm run test:db:up

# Stop test database
npm run test:db:down

# Reset test database
npm run test:db:reset
```

## Running Tests

### Unit Tests
```bash
# All unit tests
npm run test:unit

# Specific package
npm run test -- --selectProjects shared
npm run test -- --selectProjects frontend
npm run test -- --selectProjects backend

# Watch mode
npm run test:watch
```

### Integration Tests
```bash
# All integration tests
npm run test:integration

# Specific integration area
npm run test -- tests/integration/api
npm run test -- tests/integration/sync
```

### E2E Tests
```bash
# All E2E tests
npm run test:e2e

# Headed mode (see browser)
npm run test:e2e:headed

# UI mode (interactive)
npm run test:e2e:ui

# Specific test file
npx playwright test tests/e2e/user-flows/basic-navigation.spec.ts
```

### Coverage
```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### CI Pipeline
```bash
# Run all tests (as in CI)
npm run test:ci
```

## Test Data Management

### Fixtures
- **Static Data**: Pre-defined test objects in `fixtures/`
- **Dynamic Generation**: Helper functions for creating test data
- **API Mocks**: Realistic API response simulation

### Database Seeding
```typescript
import { seedDatabase } from '../utils/database';

// Seed with default data
await seedDatabase();

// Custom seeding
await seedDatabase({ users: 5, todos: 20, withConflicts: true });
```

## Best Practices

### Unit Tests
- Test behavior, not implementation
- Use descriptive test names
- Group related tests with `describe` blocks
- Mock external dependencies
- Aim for high coverage (80%+ target)

### Integration Tests
- Test real API interactions
- Use test database for isolation
- Clean up data between tests
- Test error scenarios
- Verify data persistence

### E2E Tests
- Test complete user workflows
- Use data attributes for element selection
- Test offline/online scenarios
- Keep tests independent
- Use page objects for complex interactions

## Configuration

### Jest Configuration
- **Multi-project**: Separate configs for each package
- **Module Mapping**: Path aliases for imports
- **Coverage Thresholds**: 80% minimum coverage
- **Test Environment**: JSDOM for frontend, Node for backend

### Playwright Configuration
- **Multiple Browsers**: Chrome, Firefox, Safari, Mobile
- **Web Servers**: Auto-start dev servers
- **Global Setup**: Database and authentication preparation
- **Reporting**: HTML and JSON reporters

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure shared package is built: `npm run build --workspace=shared`
   - Check path aliases in Jest configuration

2. **Database Connection Errors**
   - Verify Docker is running
   - Check if test database containers are up
   - Ensure ports 5433 and 6380 are available

3. **E2E Test Failures**
   - Confirm development servers are running
   - Check for port conflicts
   - Verify browser installation: `npx playwright install`

### Debugging

```bash
# Debug Jest tests
npm run test -- --detectOpenHandles --forceExit

# Debug Playwright tests
npx playwright test --debug

# Verbose output
npm run test -- --verbose
```

## Contributing

When adding new tests:
1. Follow the established directory structure
2. Use appropriate test level (unit/integration/e2e)
3. Include both happy path and error scenarios
4. Update fixtures and utilities as needed
5. Maintain coverage thresholds

## Future Enhancements

- **Visual Regression Testing**: Screenshot comparison
- **Performance Testing**: Lighthouse integration
- **Accessibility Testing**: axe-core integration
- **Mutation Testing**: Code quality validation
- **Load Testing**: API performance testing