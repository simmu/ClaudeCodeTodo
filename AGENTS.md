# Multi-Agent Development Coordination

## Overview
This file provides specific instructions for each agent working on the todo app. Each agent has dedicated responsibilities and should work on their designated branch.

---

## 🎨 Frontend Agent
**Branch**: `agent/frontend`  
**Primary Focus**: User interface, offline functionality, and PWA features

### Phase 1 Tasks (Foundation)
- [x] Set up React Router with main routes (`/`, `/login`, `/register`)
- [x] Create basic UI components (TodoList, TodoItem, AddTodo, Header)
- [x] Implement Tailwind CSS styling and responsive design
- [x] Set up IndexedDB with Dexie for local storage
- [x] Create local CRUD operations (add, edit, delete, toggle todos)
- [x] Implement PWA manifest and service worker registration

### Phase 2 Tasks (Integration)
- [ ] Integrate with backend API using React Query
- [ ] Add authentication flow (login/register forms)
- [ ] Implement JWT token management
- [ ] Add loading states and error handling
- [ ] Create offline indicators and sync status

### Phase 3 Tasks (Advanced)
- [ ] Implement optimistic updates for better UX
- [ ] Add drag-and-drop todo reordering
- [ ] Create filter and search functionality
- [ ] Add dark mode toggle
- [ ] Implement push notifications

### Key Files to Work On
```
packages/frontend/src/
├── components/
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── AddTodo.tsx
│   └── Header.tsx
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── hooks/
│   ├── useTodos.ts
│   └── useAuth.ts
├── services/
│   └── db.ts (IndexedDB setup)
└── utils/
    └── offline.ts
```

### Dependencies on Other Agents
- **Backend Agent**: API endpoints and authentication
- **Sync Agent**: Offline sync logic integration
- **Testing Agent**: Component and integration tests

### Testing Requirements
- Unit tests for components using React Testing Library
- Integration tests for offline functionality
- E2E tests for user workflows

---

## ⚙️ Backend Agent
**Branch**: `agent/backend`  
**Primary Focus**: REST API, database, authentication, and WebSocket connections

### Phase 1 Tasks (Foundation)
- [x] Set up Express server with TypeScript
- [x] Configure Prisma schema for todos and users
- [x] Implement database migrations
- [x] Create basic CRUD endpoints for todos
- [x] Set up CORS and security middleware

### Phase 2 Tasks (Integration)
- [ ] Implement JWT authentication system
- [ ] Create user registration and login endpoints
- [ ] Add protected route middleware
- [ ] Implement user-specific todo filtering
- [ ] Add input validation using Zod schemas

### Phase 3 Tasks (Advanced)
- [ ] Set up WebSocket server for real-time updates
- [ ] Implement sync conflict detection
- [ ] Add rate limiting and request throttling
- [ ] Create admin endpoints for user management
- [ ] Add logging and monitoring

### Key Files to Work On
```
packages/backend/src/
├── server.ts
├── routes/
│   ├── auth.ts
│   ├── todos.ts
│   └── sync.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── services/
│   ├── authService.ts
│   ├── todoService.ts
│   └── syncService.ts
├── utils/
│   └── websocket.ts
└── prisma/
    └── schema.prisma
```

### Dependencies on Other Agents
- **Shared Package**: Type definitions and validation schemas
- **Sync Agent**: Conflict resolution algorithms
- **Testing Agent**: API endpoint tests
- **DevOps Agent**: Database setup and deployment

### Testing Requirements
- Unit tests for services and utilities
- Integration tests for API endpoints
- Database test fixtures and cleanup

---

## 🔄 Sync Agent
**Branch**: `agent/sync`  
**Primary Focus**: Offline/online synchronization, conflict resolution, and data consistency

### Phase 1 Tasks (Foundation)
- [x] Design sync strategy (timestamp-based merging)
- [x] Implement basic sync queue for offline changes
- [x] Create sync status tracking
- [x] Set up background sync with Service Worker
- [x] Handle network connectivity detection

### Phase 2 Tasks (Integration)
- [ ] Implement bidirectional sync with backend
- [ ] Create conflict detection algorithms
- [ ] Add conflict resolution UI components
- [ ] Implement batch sync for performance
- [ ] Add sync retry logic with exponential backoff

### Phase 3 Tasks (Advanced)
- [ ] Implement operational transformation for real-time collaboration
- [ ] Add delta sync to minimize data transfer
- [ ] Create sync analytics and monitoring
- [ ] Implement selective sync (sync only specific todos)
- [ ] Add sync encryption for sensitive data

### Key Files to Work On
```
packages/frontend/src/sync/
├── syncManager.ts
├── conflictResolver.ts
├── queueManager.ts
└── networkMonitor.ts

packages/backend/src/sync/
├── syncController.ts
├── conflictDetector.ts
└── deltaSync.ts

public/
└── sw.js (Service Worker)
```

### Dependencies on Other Agents
- **Frontend Agent**: UI components for sync status and conflicts
- **Backend Agent**: Sync endpoints and WebSocket events
- **Testing Agent**: Sync scenario testing

### Testing Requirements
- Sync conflict simulation tests
- Network offline/online scenario tests
- Performance tests for large dataset sync

---

## 🧪 Testing Agent
**Branch**: `agent/testing`  
**Primary Focus**: Comprehensive test coverage, test automation, and quality assurance

### Phase 1 Tasks (Foundation)
- [ ] Set up Jest and React Testing Library
- [ ] Create test utilities and fixtures
- [ ] Write unit tests for shared types and utilities
- [ ] Set up test database with Docker
- [ ] Configure test scripts in package.json

### Phase 2 Tasks (Integration)
- [ ] Write integration tests for API endpoints
- [ ] Create end-to-end tests with Playwright
- [ ] Test offline functionality scenarios
- [ ] Add authentication flow tests
- [ ] Implement visual regression tests

### Phase 3 Tasks (Advanced)
- [ ] Set up performance testing with Lighthouse
- [ ] Create load testing for API endpoints
- [ ] Add accessibility testing (axe-core)
- [ ] Implement mutation testing
- [ ] Set up automated test reporting

### Key Files to Work On
```
tests/
├── unit/
│   ├── frontend/
│   ├── backend/
│   └── shared/
├── integration/
│   ├── api/
│   └── sync/
├── e2e/
│   ├── user-flows/
│   └── offline-scenarios/
├── fixtures/
└── utils/
    └── test-helpers.ts
```

### Dependencies on Other Agents
- **All Agents**: Testing their respective implementations
- **DevOps Agent**: CI/CD pipeline integration

### Testing Requirements
- Maintain 90%+ code coverage
- All tests must pass before merging
- Performance budgets must be met

---

## 🚀 DevOps Agent
**Branch**: `agent/devops`  
**Primary Focus**: Build automation, deployment, monitoring, and infrastructure

### Phase 1 Tasks (Foundation)
- [x] Set up GitHub Actions CI/CD pipeline
- [x] Configure automated testing on PRs
- [x] Set up build and deployment scripts
- [x] Create Docker containers for development
- [x] Set up environment variable management

### Phase 2 Tasks (Integration)
- [ ] Deploy backend to cloud platform (Railway/Vercel/AWS)
- [ ] Deploy frontend with CDN optimization
- [ ] Set up database hosting (PostgreSQL)
- [ ] Configure domain and SSL certificates
- [ ] Implement database backup strategy

### Phase 3 Tasks (Advanced)
- [ ] Set up monitoring and alerting (logging, metrics)
- [ ] Implement blue-green deployments
- [ ] Add performance monitoring
- [ ] Create staging environment
- [ ] Set up automated security scanning

### Key Files to Work On
```
.github/workflows/
├── ci.yml
├── deploy.yml
└── security.yml

docker/
├── Dockerfile.frontend
├── Dockerfile.backend
└── docker-compose.yml

scripts/
├── build.sh
├── deploy.sh
└── backup.sh

infrastructure/
└── (cloud platform configs)
```

### Dependencies on Other Agents
- **All Agents**: Deploying their implementations
- **Testing Agent**: CI/CD pipeline integration

### Testing Requirements
- Deployment pipeline tests
- Infrastructure as code validation
- Security vulnerability scans

---

## 🤝 Agent Coordination Rules

### Communication Protocol
1. **Branch Strategy**: Each agent works on their designated branch
2. **Pull Requests**: Cross-agent code reviews required
3. **Shared Dependencies**: Changes to `packages/shared` require all agents' approval
4. **Integration Points**: Document API contracts and interfaces

### Conflict Resolution
1. **Shared Files**: Use merge conflict resolution with team discussion
2. **Dependencies**: Update package.json changes require coordination
3. **Breaking Changes**: Announce in PR description and seek approval

### Progress Tracking
- Update this file with completed tasks (check boxes)
- Create GitHub issues for complex tasks
- Use conventional commit messages
- Tag other agents in PRs for review

### Development Workflow
```bash
# 1. Switch to your agent branch
git checkout agent/[your-agent]

# 2. Pull latest changes
git pull origin main
git rebase main

# 3. Work on your tasks
# ... make changes ...

# 4. Commit with conventional format
git commit -m "feat(frontend): add todo list component"

# 5. Push and create PR
git push origin agent/[your-agent]
# Create PR to main branch

# 6. Get reviews from other agents
# 7. Merge after approval and tests pass
```

---

## 📋 Current Sprint Priority

### Sprint 1: Foundation (Week 1-2)
- **Frontend Agent**: Basic UI and offline storage
- **Backend Agent**: API endpoints and database
- **Sync Agent**: Basic sync queue and conflict detection
- **Testing Agent**: Test infrastructure setup
- **DevOps Agent**: CI/CD pipeline and development environment

### Success Criteria
- ✅ Offline todo CRUD operations work
- ✅ Backend API endpoints functional
- ✅ Basic sync between online/offline
- ✅ Automated tests running in CI
- ✅ Development environment containerized

Ready to begin! Each agent should checkout their branch and start with Phase 1 tasks.