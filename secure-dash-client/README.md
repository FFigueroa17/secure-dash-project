# 🛡️ Secure Dash Client

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, secure dashboard client application built with Next.js 15, React 19, and TypeScript. Features a beautiful UI with Radix UI components, comprehensive testing setup, and production-ready Docker configuration.

[🚀 Getting Started](#-getting-started) • [📖 Documentation](#-documentation) • [🐳 Docker](#-docker-deployment) • [🧪 Testing](#-testing) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

- 🚀 **Modern Stack**: Next.js 15 with React 19 and TypeScript 5
- 🎨 **Beautiful UI**: Tailwind CSS 4 with Radix UI components
- 🔒 **Security First**: Built-in security headers and best practices
- 🧪 **Testing Ready**: Jest, Testing Library, and Playwright configured
- 🐳 **Docker Support**: Production-ready containerization
- ⚡ **Performance**: Turbopack for fast development builds
- 🎭 **Motion**: Beautiful animations with Framer Motion
- 📊 **Charts**: Interactive charts with Recharts
- 🌙 **Dark Mode**: Theme switching with next-themes
- 📱 **Responsive**: Mobile-first responsive design

## 🏗️ Tech Stack

<details>
<summary>Click to expand tech stack details</summary>

### Frontend

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion 12
- **Charts**: Recharts 2
- **Date Handling**: date-fns 4

### Development & Testing

- **Testing Framework**: Jest 29 with Testing Library
- **E2E Testing**: Playwright
- **Linting**: ESLint 9 with custom configuration
- **Formatting**: Prettier 3
- **Git Hooks**: Husky with lint-staged
- **Commits**: Conventional commits with Commitlint

### Build & Deployment

- **Build Tool**: Next.js with Turbopack
- **Package Manager**: npm
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose

</details>

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or later ([Download](https://nodejs.org/))
- **npm** 10.x or later (comes with Node.js)
- **Docker** 24.x or later ([Download](https://www.docker.com/get-started/))
- **Docker Compose** 2.x or later

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/secure-dash-client.git
cd secure-dash-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Application Configuration
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Add your environment variables here
# DATABASE_URL=your_database_url
# API_BASE_URL=your_api_base_url
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Documentation

### Available Scripts

| Script                     | Description                             |
| -------------------------- | --------------------------------------- |
| `npm run dev`              | Start development server with Turbopack |
| `npm run build`            | Build production application            |
| `npm run start`            | Start production server                 |
| `npm run lint`             | Run ESLint                              |
| `npm run lint:fix`         | Fix ESLint issues                       |
| `npm run typecheck`        | Run TypeScript compiler check           |
| `npm run format`           | Format code with Prettier               |
| `npm run format:check`     | Check code formatting                   |
| `npm run test`             | Run unit tests                          |
| `npm run test:watch`       | Run tests in watch mode                 |
| `npm run test:coverage`    | Generate test coverage report           |
| `npm run test:integration` | Run Playwright E2E tests                |

### Project Structure

```
secure-dash-client/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── _components/        # Shared components
│   │   ├── _lib/              # Shared utilities
│   │   ├── dashboard/         # Dashboard pages & components
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── data-table/       # Data table components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── schemas/              # Validation schemas
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── __tests__/               # Test files
├── coverage/                # Test coverage reports
├── docker-compose.yml       # Docker composition
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
└── .dockerignore           # Docker ignore file
```

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and run production container
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f secure-dash-client
```

### Development with Docker

1. Uncomment the development service in `docker-compose.yml`
2. Run the development container:

```bash
docker-compose up secure-dash-client-dev
```

### Manual Docker Commands

```bash
# Build production image
docker build -t secure-dash-client .

# Run container
docker run -p 3000:3000 secure-dash-client

# Run with environment file
docker run -p 3000:3000 --env-file .env.local secure-dash-client
```

### Docker Configuration

- **`Dockerfile`**: Multi-stage production build with security optimizations
- **`Dockerfile.dev`**: Development container with hot reloading
- **`docker-compose.yml`**: Complete orchestration with health checks
- **`.dockerignore`**: Optimized build context exclusions

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Integration Testing

```bash
# Run Playwright tests
npm run test:integration

# Run with UI
npm run test:integration:ui

# Debug mode
npm run test:integration:debug
```

### Testing Stack

- **Unit Tests**: Jest + Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Istanbul/NYC
- **Mocking**: MSW (Mock Service Worker)

## 🚀 Performance

### Optimization Features

- ⚡ **Turbopack**: Fast development builds
- 🎯 **Standalone Output**: Minimal Docker images
- 📦 **Automatic Code Splitting**: Route-based splitting
- 🖼️ **Image Optimization**: Next.js Image component
- 💾 **Caching**: Aggressive caching strategies
- 🔄 **React Compiler**: Automatic optimization

### Performance Monitoring

The application includes:

- Bundle analyzer for build optimization
- Core Web Vitals monitoring
- Runtime performance tracking

## 🔒 Security

### Security Features

- 🛡️ **Security Headers**: XSS, CSRF, and clickjacking protection
- 🔐 **Content Security Policy**: Strict CSP implementation
- 👤 **Non-root Docker User**: Container security
- 🚫 **Dependency Scanning**: Automated vulnerability checks
- 🔍 **Type Safety**: Full TypeScript coverage

### Security Headers

```typescript
// Configured in next.config.ts
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---

<div align="center">

**[⬆ Back to Top](#-secure-dash-client)**

Made with ❤️ by the Secure Dash Team (UCA)

</div>

### Real-time WebSocket Dashboard

The dashboard connects to `/ws/fail2ban-logs` endpoint to receive real-time security data:

- **Ban/Unban Chart**: Visualizes ban and unban rates per minute
- **Detection Trends**: Shows detection counts over time
- **Top IPs**: Displays IPs with highest detection counts
- **Average Detection Time**: KPI showing time from detection to ban
- **Real-time Alerts**: Toast notifications for high-risk IPs

### WebSocket Data Format

Expected data structure from `/ws/fail2ban-logs`:

```json
{
  "ban_unban_per_minute": [
    {
      "minute": "00:01",
      "ban": 1,
      "unban": 0
    }
  ],
  "detections_per_minute": [
    {
      "minute": "00:03",
      "count": 3
    }
  ],
  "top_ips": [
    {
      "ip": "192.168.2.1",
      "detections": 4
    }
  ],
  "avg_detect_to_ban_sec": 0,
  "alerts": [
    {
      "ip": "192.168.1.100",
      "bansLastHour": 5
    }
  ]
}
```

### Connection Features

- **Auto-reconnection**: Automatically reconnects on connection loss
- **Connection status indicator**: Visual feedback of WebSocket state
- **Error handling**: Graceful degradation with error messages
- **Loading states**: Skeleton loading for better UX
- **Duplicate alert prevention**: Prevents duplicate toast notifications

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing WebSocket Connection

For development/testing, you can create a simple WebSocket server:

```bash
# Install wscat for testing
npm install -g wscat

# Test WebSocket connection
wscat -c ws://localhost:3000/ws/fail2ban-logs
```

## Environment Setup

Make sure your backend WebSocket server is running and accessible at the configured endpoint.

## Build

```bash
npm run build
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
