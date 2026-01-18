This command will overwrite the `README.md` file with a new, professionally generated content that accurately describes the project based on my analysis of the codebase. This fulfills the user's request to create a new README.
# Spirit Beads UI
Spirit Beads UI is a production-ready, responsive e-commerce frontend built with React 18 and TypeScript. It features a modern, clean UI/UX designed to provide a seamless shopping experience, from browsing products to checkout. The project emphasizes a strong component architecture and leverages a utility-first design system for maximum flexibility and maintainability.
## 🚀 Live Deployment
This project is currently deployed and fully functional at: **[https://thebeadedcase.com](https://thebeadedcase.com)**
## ✨ Key Features
-   **Modern E-commerce Frontend**: A complete user flow for an online store, including dynamic product grids, category filtering, a persistent shopping cart, and a streamlined checkout process.
-   **Advanced Component Architecture**: Built using a highly organized and reusable component structure. It leverages **shadcn/ui** for the base design system, promoting consistency and rapid development.
-   **Responsive Design**: A mobile-first approach using Tailwind CSS ensures a flawless `UI/UX` across all devices, from mobile phones to desktops.
-   **Optimized State Management**: Utilizes React Hooks and custom hooks (e.g., `useCart`, `useCheckout`) for efficient and predictable `state management` without the overhead of external libraries.
-   **Performant Data Fetching**: Implements features like infinite scrolling for product lists and centralized API logic via custom hooks for optimized data handling.
-   **Typed with TypeScript**: The entire codebase is written in `TypeScript`, providing type safety, better developer experience, and fewer runtime errors in a `production-react` environment.
## 🛠️ Technical Stack
-   **Framework**: [React 18](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Framework**: [shadcn/ui](https://ui.shadcn.com/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Linting**: [ESLint](https://eslint.org/)
## 🚀 Getting Started
Follow these instructions to get the project running on your local machine for development and testing purposes.
### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Bun](https://bun.sh/) (preferred) or [npm](https://www.npmjs.com/)
### Installation
1.  **Clone the repository:**
    ```sh
    git clone https://github.com/caseyjkey/spirit-beads-ui.git
    cd spirit-beads-ui
    ```
2.  **Install dependencies:**
    Using Bun (recommended):
    ```sh
    bun install
    ```
    Alternatively, using npm:
    ```sh
    npm install
    ```
### Configuration
The application connects to a backend API. Create a `.env.local` file in the root of the project and add the following environment variable to point to your backend server:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```
### Running the Development Server
Once dependencies are installed and configuration is set, you can start the local development server.
```sh
bun run dev
```
or
```sh
npm run dev
```
The application will be available at `http://localhost:8080`.
## 💡 Usage
The primary purpose of this repository is to serve as the user-facing storefront for the Spirit Beads e-commerce platform. Users can:
- Browse and view a collection of products.
- Filter products by category.
- Add and remove items from their shopping cart.
- Proceed through a checkout flow to complete a purchase.
## 🔍 Technical Deep Dive
### Component Architecture
The project's `component-architecture` is one of its key strengths. It follows a two-tiered approach:
1.  **UI / Design System**: The `src/components/ui` directory contains the base building blocks of the application (Button, Card, Dialog, etc.). These are powered by **shadcn/ui** and are unstyled, accessible, and highly composable.
2.  **Feature Components**: The `src/components` directory contains higher-level components that compose the UI components into functional parts of the application, such as `ProductGrid`, `CartSheet`, and `CheckoutSidebar`.
### State Management
`State-management` is handled through a combination of React's built-in hooks (`useState`, `useContext`) and a suite of custom hooks located in `src/hooks`. This approach keeps the logic for features like cart management (`use-cart.tsx`) and API interactions self-contained and reusable, avoiding the need for large, boilerplate-heavy state management libraries.
### Styling & Responsive Design
The `ecommerce-frontend` is styled using **Tailwind CSS**, a utility-first CSS framework that enables rapid development of a custom `responsive-design`. The configuration in `tailwind.config.ts` defines a custom theme, including colors and fonts, that aligns with the brand's identity. This setup, combined with `shadcn/ui`'s components, creates a powerful and flexible `design-system`.
## 📚 Related Projects

- **[spirit-beads-backend](https://github.com/caseyjkey/spirit-beads-backend)** - Django e-commerce backend (live at thebeadedcase.com)
- **[spirit-beads-service](https://github.com/caseyjkey/spirit-beads-service)** - Django e-commerce backend (service layer)
- **[lighter-splitter](https://github.com/caseyjkey/lighter-splitter)** - Spirit Beads ecosystem - image processing pipeline
