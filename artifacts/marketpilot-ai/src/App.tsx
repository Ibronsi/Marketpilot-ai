import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route component={WorkspaceRoutes} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
