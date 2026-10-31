import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/auth/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import DashboardPage from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import ModulePage from '@/pages/module-page';
import NotFoundPage from '@/pages/not-found';
import { moduleConfigs } from '@/modules/module-config';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function WorkspaceRoutes() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      {Object.entries(moduleConfigs).map(([path, config]) => (
        <Route key={path} path={path}>
          <ModulePage config={config} />
        </Route>
      ))}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function AuthLoadingScreen() {
  return (
    <main className="auth-state" role="status" aria-live="polite">
      <span className="eyebrow">MarketPilot AI</span>
      <p>Vérification de votre session…</p>
    </main>
  );
}

function ProtectedWorkspace() {
  const { status } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (status === 'unauthenticated') setLocation('/login');
  }, [status, setLocation]);

  if (status === 'unconfigured') {
    return <LoginPage />;
  }

  if (status === 'unauthenticated') {
    return <AuthLoadingScreen />;
  }

  if (status === 'loading') {
    return <AuthLoadingScreen />;
  }

  return <WorkspaceRoutes />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route component={ProtectedWorkspace} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
