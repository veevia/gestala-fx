import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load page components for better performance
const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Poly = React.lazy(() => import("./pages/Poly"));
const Wob = React.lazy(() => import("./pages/Wob"));
const Ori = React.lazy(() => import("./pages/Ori"));

const queryClient = new QueryClient();

// Set the basename for the router only in production for GitHub Pages deployment.
const basename = import.meta.env.PROD ? "/gestala-fx/" : "/";

// A simple fallback component to show while pages are loading.
const PageLoader = () => <div className="w-full h-screen flex items-center justify-center">Loading...</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={basename}>
      <TooltipProvider>
        <Toaster />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/poly" element={<Poly />} />
            <Route path="/wob" element={<Wob />} />
            <Route path="/ori" element={<Ori />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
