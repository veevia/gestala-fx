# Gestala FX Playground

Gestala FX Playground is an experimental laboratory for advanced UI components and visual effects. It focuses on high-performance rendering patterns, specifically exploring the **"Sidecar" pattern** to decouple complex logic from the view layer.

## 🚀 Key Features

- **Sidecar Architecture**: Separation of UI components from their heavyweight logic and side effects.
- **Advanced Code-Splitting**: Optimized initial page loads by deferring non-critical interactivity.
- **Modern UI Kit**: Built with Radix UI, TanStack Query, and Recharts.
- **Premium Aesthetics**: Clean, responsive, and performant design using Tailwind CSS.

## 🛠 Technology Stack

- **Runtime**: [Bun](https://bun.sh/) (Fast all-in-one JavaScript runtime)
- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🏁 Getting Started

### Prerequisites

This project uses **Bun**. If you don't have it installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/veevia/gestala-fx.git
   cd gestala-fx
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

## 🧠 Core Concepts: The Sidecar Pattern

The primary architectural exploration in this playground is treating UI effects as **"sidecars"** to main components.

*   **Render Fast**: The UI skeleton and critical views render immediately.
*   **Lazy Logic**: Heavy interactivity, animations, and effect calculations are loaded asynchronously.
*   **Decoupled Complexity**: Logic is decoupled from the `render` lifecycle, making components easier to test and reuse.

## 📜 Available Scripts

- `bun run dev`: Start the development server.
- `bun run build`: Build the application for production.
- `bun run lint`: Run ESLint to check for code quality.
- `bun run preview`: Preview the production build locally.
- `bun run deploy`: Deploy the application to GitHub Pages.

---

Built with ❤️ by [veevia](https://github.com/veevia)
