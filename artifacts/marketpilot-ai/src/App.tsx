import { useEffect, useRef, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/auth/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import DashboardPage from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import NotFoundPage from '@/pages/not-found';
import { CampaignsPage, ConversationsPage, CrmPage, MarketingPage, ProspectionPage } from '@/pages/data-pages';
import SettingsPage from '@/pages/settings';
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
      <Route path="/marketing" component={MarketingPage} />
      <Route path="/prospection" component={ProspectionPage} />
      <Route path="/crm" component={CrmPage} />
      <Route path="/conversations" component={ConversationsPage} />
      <Route path="/campagnes" component={CampaignsPage} />
      <Route path="/parametres" component={SettingsPage} />
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
  const { status, user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const identity = status === 'authenticated' ? user?.id ?? null : status === 'unauthenticated' ? null : undefined;
  const previousIdentity = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (status === 'unauthenticated') setLocation('/login');
  }, [status, setLocation]);
  useEffect(() => {
    if (identity !== undefined) {
      if (previousIdentity.current !== undefined && previousIdentity.current !== identity) queryClient.clear();
      previousIdentity.current = identity;
    }
  }, [identity, queryClient]);

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
