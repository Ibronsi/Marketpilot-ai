import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'wouter';
import { Brand } from '@/components/brand';

export default function LoginPage() {
  return (
    <div className="login-page">
      <aside className="login-aside">
        <Link href="/" className="login-brand">
          <Brand />
        </Link>
        <div className="login-manifesto">
          <div className="eyebrow">Un espace pour entreprendre</div>
          <h1>
            Vos idées.
            <br />
            Votre prochain pas.
          </h1>
          <p>
            MarketPilot réunit marketing, prospection et vente dans un espace
            clair, conçu pour les petites équipes.
          </p>
        </div>
        <div className="login-foot">
          Un outil en construction, avec vous aux commandes.
        </div>
      </aside>
      <main className="login-content">
        <section className="login-card">
          <span className="eyebrow">Accès à votre espace</span>
          <h2>Connexion</h2>
          <p>
            La connexion n’est pas encore disponible. Cette page ne crée pas de
            session et ne transmet aucune information.
          </p>
          <div
            className="auth-notice"
            role="status"
            data-testid="status-auth-unavailable"
          >
            <ShieldAlert size={17} />
            <div>
              <strong>Aucun service d’authentification relié</strong>
              <span>
                L’authentification Supabase ou un autre fournisseur n’est pas
                configurée. Vos identifiants ne doivent pas être saisis ici.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="disabled-signin"
            disabled
            aria-disabled="true"
            data-testid="button-signin-disabled"
          >
            Connexion indisponible — bientôt
          </button>
          <Link
            href="/"
            className="back-home"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft size={14} /> Retour au tableau de bord
          </Link>
        </section>
      </main>
    </div>
  );
}
