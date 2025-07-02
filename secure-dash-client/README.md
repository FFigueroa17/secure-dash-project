# 🛡️ SecureDash - Real-time Security Monitoring Dashboard

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**A modern, real-time security dashboard for Fail2Ban monitoring and IP threat management**

Built with cutting-edge technologies including Next.js 15, React 19, TypeScript, and WebSocket real-time capabilities.

[🚀 Quick Start](#-quick-start) • [📊 Features](#-features) • [🏗️ Architecture](#️-architecture) • [🐳 Docker](#-docker-deployment) • [🧪 Testing](#-testing)

![Dashboard Preview](https://via.placeholder.com/800x400/0f172a/38bdf8?text=SecureDash%20Dashboard)

</div>

---

## 🌟 What is SecureDash?

SecureDash is a sophisticated security monitoring dashboard designed specifically for **Fail2Ban** systems. It provides real-time visualization of security events, banned IP management, and comprehensive threat analysis through an intuitive web interface.

### 🎯 Perfect For

- **System Administrators** monitoring server security
- **DevOps Teams** managing infrastructure security
- **Security Engineers** analyzing attack patterns
- **Organizations** requiring real-time threat visibility

---

## ✨ Features

### 🔴 Real-time Security Monitoring

- **Live WebSocket Dashboard** - Real-time updates from Fail2Ban logs
- **Ban/Unban Rate Visualization** - Interactive charts showing security events per minute
- **Detection Trend Analysis** - Monitor attack patterns over time
- **Average Detection Time KPIs** - Track response times from detection to ban
- **Alert System** - Toast notifications for high-risk IPs and repeated offenders

### 🛡️ Advanced IP Management

- **Comprehensive Banned IPs Table** - Detailed view of all blocked IPs
- **Threat Level Assessment** - Automated threat scoring based on behavior patterns
- **IP Reputation Tracking** - Historical data on repeat offenders
- **Geographic Analysis** - Country-based threat visualization
- **Manual IP Banning** - Admin controls for proactive blocking

### 📊 Intelligent Analytics

- **Top Threat IPs Dashboard** - Identify most dangerous sources
- **Activity Trend Charts** - Visualize attack patterns and timing
- **Statistical Overviews** - Comprehensive metrics and summaries
- **Export Capabilities** - CSV export for external analysis
- **Advanced Filtering** - Multi-column search and date range filtering

### 👥 User & Role Management

- **JWT-based Authentication** - Secure session management
- **Role-based Access Control (RBAC)** - Admin and User permission levels
- **User Management Interface** - Create, edit, and manage system users
- **Session Security** - HTTP-only cookies with automatic expiration

### 🎨 Modern User Experience

- **Responsive Design** - Mobile-first, works on all devices
- **Dark/Light Theme** - Automatic and manual theme switching
- **Beautiful Animations** - Smooth transitions with Framer Motion
- **Intuitive Navigation** - Sidebar navigation with breadcrumbs
- **Loading States** - Skeleton loading for optimal perceived performance

---

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5 with strict type checking
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand for WebSocket data and global state
- **Data Fetching**: TanStack Query for server state management
- **Real-time**: WebSocket connections with auto-reconnection
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Recharts for data visualization

### Backend Integration

- **API Communication**: RESTful APIs with JWT authentication
- **WebSocket Endpoint**: `/ws/fail2ban-logs` for real-time updates
- **Authentication**: Secure JWT tokens with role-based permissions
- **Data Format**: JSON-based API responses with TypeScript validation

### Development & Production

- **Build Tool**: Next.js with Turbopack for fast development
- **Testing**: Jest + Testing Library + Playwright for comprehensive coverage
- **Linting**: ESLint 9 with custom rules and Prettier formatting
- **Git Hooks**: Husky + lint-staged for code quality
- **Containerization**: Multi-stage Docker builds for production optimization

---

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** 20.x or later ([Download](https://nodejs.org/))
- **npm** 10.x or later (included with Node.js)
- **Docker** 24.x or later ([Download](https://www.docker.com/get-started/))
- **Docker Compose** 2.x or later

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/secure-dash-client.git
cd secure-dash-client

# Install dependencies
npm install
```

### 2. Environment Configuration

Create your environment file:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Application Configuration
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# API Configuration (Required)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/fail2ban-logs

# Session Security (Required)
SESSION_SECRET=your-super-secure-session-secret-here
```

### 3. Start Development

```bash
# Start the development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your credentials.

### 4. Backend Requirements

Ensure your Fail2Ban API backend is running and provides:

- Authentication endpoint: `POST /login`
- User data endpoint: `GET /whoami`
- Real-time WebSocket: `ws://localhost:8000/ws/fail2ban-logs`

---

## 📊 Dashboard Features

### Real-time Security Dashboard

The main dashboard connects to your Fail2Ban system via WebSocket to provide:

#### 📈 Ban/Unban Rate Chart

```json
{
  "ban_unban_per_minute": [
    {
      "minute": "14:30",
      "ban": 3,
      "unban": 1
    }
  ]
}
```

#### 🔍 Detection Trends

```json
{
  "detections_per_minute": [
    {
      "minute": "14:30",
      "count": 5
    }
  ]
}
```

#### 🥇 Top Threat IPs

```json
{
  "top_ips": [
    {
      "ip": "192.168.1.100",
      "detections": 15
    }
  ]
}
```

#### ⚡ Performance Metrics

```json
{
  "avg_detect_to_ban_sec": 2.5
}
```

#### 🚨 Real-time Alerts

```json
{
  "alerts": [
    {
      "ip": "192.168.1.100",
      "bansLastHour": 8
    }
  ]
}
```

### Connection Features

- **Auto-reconnection**: Seamless reconnection on connection loss
- **Connection status indicator**: Visual feedback of WebSocket state
- **Error handling**: Graceful degradation with user-friendly messages
- **Duplicate prevention**: Smart alert deduplication

---

## 📁 Project Structure

```
secure-dash-client/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── _components/              # Auth components (login, register)
│   │   ├── _lib/                     # Auth utilities and schemas
│   │   ├── app/                      # Main application
│   │   │   ├── _components/          # Shared app components
│   │   │   ├── _lib/                 # Shared utilities and queries
│   │   │   ├── dashboard/            # Real-time dashboard
│   │   │   │   ├── _components/      # Dashboard-specific components
│   │   │   │   │   └── stats/        # Chart and stats components
│   │   │   │   └── _lib/             # Dashboard utilities
│   │   │   ├── banned-ips/           # IP management interface
│   │   │   │   ├── _components/      # IP table and management
│   │   │   │   └── _lib/             # IP-related logic
│   │   │   ├── users/                # User management (Admin only)
│   │   │   │   ├── _components/      # User CRUD components
│   │   │   │   └── _lib/             # User management logic
│   │   │   └── page.tsx              # Fail2Ban logs main page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Authentication page
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Base UI components (Radix UI)
│   │   ├── data-table/               # Advanced data table components
│   │   ├── stats/                    # Statistics components
│   │   └── sidebar/                  # Navigation components
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-dashboard-websocket.ts # WebSocket connection hook
│   │   ├── use-data-table.ts         # Data table state management
│   │   └── use-mobile.ts             # Responsive utilities
│   ├── lib/                          # Core utilities
│   │   ├── store/                    # Zustand state management
│   │   │   ├── dashboard-store.ts    # Dashboard WebSocket state
│   │   │   └── user-store.ts         # User session state
│   │   ├── dal.ts                    # Data Access Layer
│   │   ├── session.ts                # JWT session management
│   │   ├── export.ts                 # CSV export utilities
│   │   └── utils.ts                  # General utilities
│   ├── actions/                      # Server actions
│   │   └── auth.ts                   # Authentication actions
│   ├── schemas/                      # TypeScript/Zod schemas
│   │   ├── log.ts                    # Fail2Ban log types
│   │   └── user.ts                   # User management types
│   ├── types/                        # Type definitions
│   │   ├── permissions.ts            # RBAC types
│   │   └── data-table.ts             # Table-related types
│   └── middleware.ts                 # Route protection middleware
├── __tests__/                        # Test suites
│   ├── components/                   # Component tests
│   ├── hooks/                        # Hook tests
│   ├── lib/                          # Utility tests
│   └── integration/                  # E2E tests
├── public/                           # Static assets
│   └── secure-dash-logo.svg          # Application logo
├── docker-compose.yml                # Container orchestration
├── Dockerfile                        # Production container
└── package.json                      # Dependencies and scripts
```

---

## 🧰 Available Scripts

| Script                           | Description                             |
| -------------------------------- | --------------------------------------- |
| `npm run dev`                    | Start development server with Turbopack |
| `npm run build`                  | Build production application            |
| `npm run start`                  | Start production server                 |
| `npm run lint`                   | Run ESLint code analysis                |
| `npm run lint:fix`               | Auto-fix ESLint issues                  |
| `npm run typecheck`              | Run TypeScript compiler check           |
| `npm run format`                 | Format code with Prettier               |
| `npm run format:check`           | Check code formatting                   |
| `npm run test`                   | Run unit tests with Jest                |
| `npm run test:watch`             | Run tests in watch mode                 |
| `npm run test:coverage`          | Generate test coverage report           |
| `npm run test:integration`       | Run Playwright E2E tests                |
| `npm run test:integration:ui`    | Run E2E tests with UI                   |
| `npm run test:integration:debug` | Debug E2E tests                         |

---

## 🐳 Docker Deployment

### Production Deployment

```bash
# Quick start with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f secure-dash-client
```

### Manual Docker Commands

```bash
# Build production image
docker build -t secure-dash-client .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url \
  -e SESSION_SECRET=your-session-secret \
  secure-dash-client
```

### Docker Configuration Features

- **Multi-stage builds** for optimized image size
- **Non-root user** for enhanced security
- **Health checks** for container monitoring
- **Environment variable support** for flexible configuration
- **Standalone output** for minimal runtime dependencies

---

## 🧪 Testing

### Test Coverage

The project includes comprehensive testing:

- **Unit Tests**: Components, hooks, and utilities
- **Integration Tests**: API interactions and user flows
- **E2E Tests**: Complete user scenarios with Playwright

### Running Tests

```bash
# Unit tests
npm run test
npm run test:coverage

# E2E tests
npm run test:integration
npm run test:integration:ui
```

### Testing Stack

- **Jest 29** - Unit test runner with coverage
- **Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing framework
- **MSW** - API mocking for integration tests

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Session Management** - Secure, HTTP-only cookies
- **Role-based Access Control** - Admin and User permission levels
- **Session Expiration** - Automatic logout after 1 hour
- **Route Protection** - Middleware-based access control

### Security Headers

```typescript
// Configured in next.config.ts
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];
```

### Data Protection

- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content sanitization
- **CSRF Protection** - SameSite cookie configuration

---

## ⚡ Performance

### Optimization Features

- **Turbopack** - Lightning-fast development builds
- **React Compiler** - Automatic optimization for React 19
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Standalone Output** - Minimal Docker containers

### Performance Monitoring

- Core Web Vitals tracking
- Bundle size analysis
- Runtime performance monitoring

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** using conventional commits: `git commit -m 'feat: add amazing feature'`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Code Quality

- **ESLint** - Code analysis and style enforcement
- **Prettier** - Consistent code formatting
- **TypeScript** - Type safety and better developer experience
- **Husky** - Pre-commit hooks for quality assurance

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [**Next.js**](https://nextjs.org/) - The React framework for production
- [**Radix UI**](https://www.radix-ui.com/) - Low-level UI primitives
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
- [**Zustand**](https://github.com/pmndrs/zustand) - Lightweight state management
- [**Recharts**](https://recharts.org/) - Beautiful React charts
- [**Fail2Ban**](https://www.fail2ban.org/) - Intrusion prevention framework

---

## 🚀 What's Next?

### Planned Features

- **🌍 Multi-language Support** - Internationalization
- **📧 Email Notifications** - Alert system integration
- **📱 Mobile App** - React Native companion
- **🤖 AI Threat Detection** - Machine learning integration
- **📊 Advanced Analytics** - Custom dashboard builder

---

<div align="center">

**[⬆ Back to Top](#️-securedash---real-time-security-monitoring-dashboard)**

Made with ❤️ by the **Secure Dash Team (UCA)**

---

_Secure your infrastructure. Monitor in real-time. Stay protected._

</div>
