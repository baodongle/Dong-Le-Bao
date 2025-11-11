# Fancy Form

[fancy-form-two.vercel.app](https://fancy-form-two.vercel.app/)

A modern React application built with Feature-Sliced Design architecture, showcasing a currency swap interface.

## 🏗️ Architecture

This project follows the **[Feature-Sliced Design (FSD)](https://feature-sliced.design/)** methodology, which organizes code by business value and technical responsibility.

### Folder Structure
```

src/
├── app/              # Application initialization layer
├── pages/            # Page-level components
│   └── swap/         # Swap page feature
│       ├── api/      # API layer for swap functionality
│       └── ui/       # Swap page UI components
├── widgets/          # Complex UI blocks composed of features
│   └── currency-swap/
│       ├── lib/      # Helper functions and utilities
│       ├── model/    # Business logic and state management
│       └── ui/       # Widget UI components
├── entities/         # Business entities
├── shared/           # Shared reusable code
│   ├── api/          # API client configuration
│   ├── lib/          # Utility functions
│   └── ui/           # UI kit components
└── assets/           # Static assets
```
### FSD Layers

- **`app/`** — Application initialization, global styles, and providers
- **`pages/`** — Full-page components with routing
- **`widgets/`** — Compositional layer combining features and entities
- **`entities/`** — Business entities with their logic and UI
- **`shared/`** — Reusable utilities, UI components, and configurations

## 🛠️ Tech Stack

### Core
- **[React 19.2.0](https://react.dev/)** — UI library
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite 7.2.2](https://vitejs.dev/)** — Build tool and dev server

### State Management & Data Fetching
- **[@tanstack/react-query 5.90.7](https://tanstack.com/query)** — Server state management
- **[@tanstack/react-form 1.23.8](https://tanstack.com/form)** — Type-safe form handling

### UI & Styling
- **[Tailwind CSS 4.1.17](https://tailwindcss.com/)** — Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Beautifully designed components built with Radix UI
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[Motion](https://motion.dev/)** — Animation library

### API & Utilities
- **[Ky 1.14.0](https://github.com/sindresorhus/ky)** — HTTP client
- **[Zod 4.1.12](https://zod.dev/)** — Schema validation
- **[React Number Format 5.4.4](https://s-yadav.github.io/react-number-format/)** — Number formatting

### Development Tools
- **[Nx 22.0.2](https://nx.dev/)** — Monorepo tooling
- **[ESLint 9.39.1](https://eslint.org/)** — Code linting
  - eslint-config-sheriff, @tanstack/eslint-plugin-query
- **[Prettier 3.6.2](https://prettier.io/)** — Code formatting
- **[Bun](https://bun.sh/)** — Package manager

## 🚀 Getting Started

### Install dependencies
```sh
bun install
```
### Run development server
```sh
bun start
# or
bun nx serve fancy-form
```
### Build for production
```sh
bun run build
# or
bun nx build fancy-form
```
## 📋 Available Scripts

- `bun start` — Start development server
- `bun run build` — Build for production

## 📚 Learn More

- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [Nx Documentation](https://nx.dev)
- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [TanStack Form Documentation](https://tanstack.com/form)
