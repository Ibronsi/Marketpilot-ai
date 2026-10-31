import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div>
        <div className="eyebrow">MarketPilot AI</div>
        <h1>Cette page n’existe pas.</h1>
        <p>Le lien demandé ne correspond à aucun espace.</p>
        <Link href="/">Revenir au tableau de bord</Link>
      </div>
    </div>
  );
}
