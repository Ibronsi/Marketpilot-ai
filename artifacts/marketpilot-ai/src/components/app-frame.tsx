import type { ReactNode } from 'react';
import { ChevronRight, CircleHelp, LockKeyhole, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { Brand } from '@/components/brand';
import { Navigation } from '@/components/navigation';

export function AppFrame({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
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
              MP
            </div>
            <div className="profile-copy">
              <b>Espace de travail</b>
              <span>Configuration locale</span>
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
            <span className="env-pill">
              <i className="env-dot" />
              FONDATION VISUELLE
            </span>
            <Link href="/login" className="top-login" data-testid="link-login">
              <LockKeyhole size={14} /> Connexion
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <Navigation mobile />
      </div>
    </div>
  );
}
