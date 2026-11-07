import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { ErrorBoundary } from "@/Components/ErrorBoundary";
import { AppRoutes } from "@/Routes";
import "./index.css";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
