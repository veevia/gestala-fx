 # Gestala FX Playground

 This project is a playground for experimenting with UI/visual effects, with a focus on advanced code-splitting patterns and component architecture. The primary exploration is around the "sidecar" pattern, which separates view-layer components from their logic and side effects.

 ## Core Concepts

 The core idea is to treat UI effects as "sidecars" to the main UI components. This allows for:

 *   **Improved Code Splitting**: The UI can be rendered immediately, while heavier logic for interactivity and effects can be loaded asynchronously. This is inspired by patterns discussed for large-scale JavaScript applications.
 *   **Decoupled Architecture**: By separating the view from its logic, components become more focused and reusable. The `use-sidecar` library is a key part of this exploration.
 *   **Enhanced Performance**: Deferring the loading and execution of non-critical effects can significantly improve initial page load and interactivity metrics.

 This playground serves as a practical environment to test these "gestala" effects and patterns.

 ## Technology Stack

 This project is built with a modern frontend stack:

 *   **Vite**: For a fast and lean development experience.
 *   **React**: For building the user interface.
 *   **TypeScript**: For type safety and improved developer experience.
 *   **Tailwind CSS**: For utility-first styling.
 *   **shadcn-ui**: For beautifully designed, accessible, and composable components.

 ## Development

 To get started with the project locally, follow these steps. You'll need to have Node.js and npm installed.

 ```sh
 # 1. Clone the repository
 git clone <YOUR_GIT_URL>

 # 2. Navigate to the project directory
 cd gestala-fx

 # 3. Install dependencies
 npm install

 # 4. Start the development server
npm run dev
