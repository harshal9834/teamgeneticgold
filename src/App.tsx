import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";

import Navigation from "./components/Navigation";

import Upload from "./pages/Upload";
import Classification from "./pages/Classification";
import Insights from "./pages/Insights";
import Novelty from "./pages/Novelty";
import Maps from "./pages/Maps";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

import UploadGuard from "./components/UploadGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />

          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              }
            />

            <Route
              path="/classification"
              element={
                <PrivateRoute>
                  <UploadGuard>
                    <Classification />
                  </UploadGuard>
                </PrivateRoute>
              }
            />

            <Route
              path="/insights"
              element={
                <PrivateRoute>
                  <UploadGuard>
                    <Insights />
                  </UploadGuard>
                </PrivateRoute>
              }
            />

            <Route
              path="/novelty"
              element={
                <PrivateRoute>
                  <UploadGuard>
                    <Novelty />
                  </UploadGuard>
                </PrivateRoute>
              }
            />

            <Route
              path="/maps"
              element={
                <PrivateRoute>
                  <UploadGuard>
                    <Maps />
                  </UploadGuard>
                </PrivateRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <UploadGuard>
                    <Reports />
                  </UploadGuard>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
