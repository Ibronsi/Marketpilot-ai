import { ArrowDownRight, BadgeCheck, LockKeyhole, ShieldAlert } from 'lucide-react';
import { AppFrame } from '@/components/app-frame';
import type { WorkspaceModule } from '@/modules/module-config';

export default function ModulePage({ config }: { config: WorkspaceModule }) {
  const Icon = config.icon;

  return (
    <AppFrame title={config.title}>
      <div className="main-content">
        <div className="eyebrow">{config.eyebrow}</div>
        <h1 className="page-title">{config.title}</h1>
        <p className="page-subtitle">{config.subtitle}</p>
        <section
          className="module-hero"
          aria-label={`${config.title} en préparation`}
        >
          <div className="module-content">
            <div className="module-symbol">
              <Icon size={21} strokeWidth={1.7} />
            </div>
            <span className="prep-badge">
              <ArrowDownRight size={12} /> En préparation
            </span>
            <h2>Un espace pensé pour avancer, sans perdre la main.</h2>
            <p>{config.intro}</p>
            <div className="module-status">
              <ShieldAlert size={14} />
              {config.scope}
            </div>
          </div>
        </section>
        <div className="module-lower">
          <section className="info-tile">
            <div className="tile-label">
              <BadgeCheck size={16} color="#4a806d" /> Prochaine étape
            </div>
            <p>
              {config.nextStep}. Cette étape sera disponible lorsque les outils
              de cet espace seront implémentés.
            </p>
          </section>
          <section className="info-tile">
            <div className="tile-label">
              <LockKeyhole size={15} color="#987a43" /> Aucun service connecté
            </div>
            <p>
              Les intégrations et les fonctions d’assistance ne sont pas encore
              branchées. Rien ne s’exécute en arrière-plan.
            </p>
          </section>
        </div>
      </div>
    </AppFrame>
  );
}
