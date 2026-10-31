import type { ReactNode } from 'react';
import {
  ChevronRight,
  CircleHelp,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/auth/auth-context';
import { Brand } from '@/components/brand';
import { Navigation } from '@/components/navigation';

export function AppFrame({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const { user, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSignOutError(null);
    try {
      await signOut();
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : 'La déconnexion a échoué.',
      );
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Menu MarketPilot">
        <Brand />
        <div className="nav-label">Espace de travail</div>
        <Navigation />
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Sparkles size={15} color="#a4c9b9" />
            <strong>Un copilote, pas un pilote automatique.</strong>
            <p>Vous gardez le contrôle de chaque action et de chaque décision.</p>
          </div>
          <div className="side-profile">
            <div className="profile-avatar" aria-hidden="true">
              {user?.email?.slice(0, 2).toUpperCase() ?? 'MP'}
            </div>
            <div className="profile-copy">
              <b>{user?.email ?? 'Compte utilisateur'}</b>
              <span>Session authentifiée</span>
            </div>
            <CircleHelp size={16} color="#96a6a9" aria-label="Aide" />
          </div>
        </div>
      </aside>

      <div className="workspace">
        <div className="mobile-header">
          <Brand />
          <span className="env-pill">
            <i className="env-dot" />
            APERÇU
          </span>
        </div>
        <header className="topbar">
          <div className="breadcrumbs" data-testid="text-breadcrumb">
            <span>MarketPilot</span>
            <ChevronRight size={13} />
            <span>{title}</span>
          </div>
          <div className="topbar-right">
            <button
              type="button"
              className="top-login auth-logout"
              onClick={handleSignOut}
              data-testid="button-signout"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </header>
        {signOutError && (
          <div className="auth-inline-error" role="alert">
            Déconnexion impossible : {signOutError}
          </div>
        )}
        <main>{children}</main>
        <Navigation mobile />
      </div>
    </div>
  );
}
