import {
  ArrowRight,
  ContactRound,
  Inbox,
  Megaphone,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'wouter';
import { AppFrame } from '@/components/app-frame';

export default function DashboardPage() {
  return (
    <AppFrame title="Vue d’ensemble">
      <div className="main-content">
        <div className="welcome-row">
          <div>
            <div className="eyebrow">Votre cockpit commercial</div>
            <h1 className="page-title">Bonjour, bienvenue.</h1>
            <p className="page-subtitle">
              Un espace pour mettre votre marketing et votre développement
              commercial en mouvement, à votre rythme.
            </p>
          </div>
          <span className="date-note">Aucune donnée connectée</span>
        </div>

        <section className="readiness-banner" aria-label="État de préparation">
          <div className="banner-copy">
            <div className="banner-icon">
              <Sparkles size={17} />
            </div>
            <h2>Tout commence par votre prochaine priorité.</h2>
            <p>
              MarketPilot est actuellement une fondation visuelle. Vos
              indicateurs et votre activité apparaîtront ici une fois vos outils
              connectés — rien n’est simulé.
            </p>
          </div>
          <span className="banner-tag">
            <i className="env-dot" />
            Configuration à venir
          </span>
        </section>

        <div className="section-heading">
          <h2>Votre espace aujourd’hui</h2>
          <span>Aucune activité à afficher</span>
        </div>

        <div className="workspace-grid">
          <section className="panel" aria-labelledby="activity-heading">
            <div className="panel-head">
              <div>
                <h3 id="activity-heading">Activité récente</h3>
                <p>Vos actions et celles de votre équipe</p>
              </div>
              <span className="quiet-label">En attente de connexion</span>
            </div>
            <div className="empty-activity">
              <div>
                <div className="empty-illustration">
                  <Inbox size={21} strokeWidth={1.6} />
                </div>
                <h4>Rien à signaler pour le moment</h4>
                <p>
                  Les activités apparaîtront ici après la mise en place des
                  espaces et de leurs intégrations.
                </p>
                <Link href="/parametres" data-testid="link-activity-settings">
                  Voir les paramètres <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </section>

          <section className="panel" aria-labelledby="start-heading">
            <div className="panel-head">
              <div>
                <h3 id="start-heading">Pour bien démarrer</h3>
                <p>Choisissez un espace à préparer</p>
              </div>
              <span className="quiet-label">3 pistes</span>
            </div>
            <div className="start-list">
              <Link
                href="/marketing"
                className="start-item"
                data-testid="link-start-marketing"
              >
                <span className="start-icon">
                  <Megaphone size={16} />
                </span>
                <span className="start-copy">
                  <b>Poser votre stratégie marketing</b>
                  <span>Clarifiez votre message et votre audience</span>
                </span>
                <ArrowRight className="start-arrow" size={15} />
              </Link>
              <Link
                href="/prospection"
                className="start-item"
                data-testid="link-start-prospection"
              >
                <span className="start-icon">
                  <Target size={16} />
                </span>
                <span className="start-copy">
                  <b>Définir vos prospects</b>
                  <span>Identifiez les bonnes opportunités</span>
                </span>
                <ArrowRight className="start-arrow" size={15} />
              </Link>
              <Link
                href="/crm"
                className="start-item"
                data-testid="link-start-crm"
              >
                <span className="start-icon">
                  <ContactRound size={16} />
                </span>
                <span className="start-copy">
                  <b>Préparer votre suivi client</b>
                  <span>Gardez chaque relation en perspective</span>
                </span>
                <ArrowRight className="start-arrow" size={15} />
              </Link>
            </div>
          </section>
        </div>

        <div className="foundation-note" data-testid="status-foundation">
          <ShieldAlert size={14} />
          <span>
            <strong>Transparence :</strong> aucun compte n’est relié, aucune
            donnée réelle n’est chargée et aucune action commerciale n’a été
            effectuée. Les fonctions sont en préparation.
          </span>
        </div>
      </div>
    </AppFrame>
  );
}
