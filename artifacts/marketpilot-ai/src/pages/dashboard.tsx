import { ArrowRight, ContactRound, FileText, MessageSquareText, Megaphone, Target, Workflow, RotateCw } from 'lucide-react';
import { Link } from 'wouter';
import { AppFrame } from '@/components/app-frame';
import { useCampaigns, useDrafts, useFollowUps, useLeads } from '@/components/marketpilot-data-hooks';
import type { Campaign, FollowUp, Lead, MarketingDraft } from '@/lib/data/marketpilot';

type Activity = { id: string; date: string; label: string; detail: string; route: string };
function toActivity(items: Array<Lead | MarketingDraft | Campaign | FollowUp>, route: string, title: (item: Lead | MarketingDraft | Campaign | FollowUp) => string, kind: string): Activity[] {
  return items.map((item) => ({ id: item.id, date: item.updated_at, label: title(item), detail: `${kind} · ${new Date(item.updated_at).toLocaleDateString('fr-CA')}`, route }));
}

export default function DashboardPage() {
  const leads = useLeads(); const drafts = useDrafts(); const campaigns = useCampaigns(); const followUps = useFollowUps();
  const loading = leads.isLoading || drafts.isLoading || campaigns.isLoading || followUps.isLoading;
  const errors = [leads.error, drafts.error, campaigns.error, followUps.error].filter(Boolean);
  const activity = [
    ...toActivity(leads.data ?? [], '/crm', (item) => (item as Lead).name, 'Contact'),
    ...toActivity(drafts.data ?? [], '/marketing', (item) => (item as MarketingDraft).title, 'Contenu'),
    ...toActivity(campaigns.data ?? [], '/campagnes', (item) => (item as Campaign).name, 'Campagne'),
    ...toActivity(followUps.data ?? [], '/conversations', (item) => (item as FollowUp).subject, 'Suivi'),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const allLoaded = !loading && errors.length === 0;

  return <AppFrame title="Vue d’ensemble"><div className="main-content">
    <div className="welcome-row"><div><div className="eyebrow">Votre espace de travail</div><h1 className="page-title">Gardez le cap, à votre rythme.</h1><p className="page-subtitle">Une vue honnête de vos contenus, contacts et suivis. Chaque prochaine étape reste entre vos mains.</p></div><span className="date-note">Données de votre espace</span></div>
    {loading ? <div className="metric-strip" role="status" data-testid="status-loading">{['a','b','c'].map((key) => <div className="metric-tile" key={key}><span>Chargement des données</span><div className="skeleton-lines"><span /></div></div>)}</div>
      : <section className="metric-strip" aria-label="Résumé de l’espace" data-testid="summary-live">
        <div className="metric-tile"><span>Contacts enregistrés</span><strong>{leads.data?.length ?? '—'}</strong></div>
        <div className="metric-tile"><span>Brouillons marketing</span><strong>{drafts.data?.length ?? '—'}</strong></div>
        <div className="metric-tile"><span>Plans de campagne</span><strong>{campaigns.data?.length ?? '—'}</strong></div>
      </section>}
    {errors.length > 0 && <div className="inline-error" role="alert" data-testid="status-dashboard-error"><strong>Une partie des données n’a pas pu être chargée.</strong><br />{errors[0]?.message}<div style={{ marginTop: 9 }}><button type="button" className="quiet-button" onClick={() => { void leads.refetch(); void drafts.refetch(); void campaigns.refetch(); void followUps.refetch(); }} data-testid="button-retry-dashboard"><RotateCw size={13} /> Réessayer</button></div></div>}
    <div className="section-heading"><h2>Votre activité</h2><span>{allLoaded ? `${activity.length} élément${activity.length === 1 ? '' : 's'} récent${activity.length === 1 ? '' : 's'}` : 'Partiellement indisponible'}</span></div>
    <div className="dashboard-bottom">
      <section className="panel"><div className="panel-head"><div><h3>Derniers changements</h3><p>Basés sur les éléments réels de votre espace</p></div><span className="quiet-label">Lecture seule</span></div>
        {loading ? <div className="loading-state" role="status"><div className="skeleton-lines"><span /><span /><span /></div></div>
          : activity.length ? <div className="dashboard-links">{activity.map((item) => <Link key={`${item.route}-${item.id}`} href={item.route} className="dashboard-link" data-testid={`link-activity-${item.id}`}><span className="dashboard-link-icon"><FileText size={16} /></span><span className="dashboard-link-copy"><strong>{item.label || 'Sans titre'}</strong><span>{item.detail}</span></span><ArrowRight size={14} /></Link>)}</div>
            : errors.length === 0 ? <div className="empty-state" data-testid="status-empty-activity"><div className="empty-state-inner"><span className="empty-mark"><FileText size={19} /></span><h3>Aucune activité pour l’instant</h3><p>Les éléments apparaîtront ici après leur création dans les espaces concernés.</p></div></div>
              : <div className="empty-state"><div className="empty-state-inner"><h3>Activité indisponible</h3><p>Réessayez lorsque la connexion aux données sera rétablie.</p></div></div>}
      </section>
      <section className="panel"><div className="panel-head"><div><h3>Aller à un espace</h3><p>Choisissez votre prochaine tâche</p></div></div>
        <div className="dashboard-links">
          <Link href="/marketing" className="dashboard-link" data-testid="link-dashboard-marketing"><span className="dashboard-link-icon"><Megaphone size={16} /></span><span className="dashboard-link-copy"><strong>Préparer un contenu</strong><span>Gardez le brouillon, publiez vous-même</span></span><ArrowRight size={14} /></Link>
          <Link href="/prospection" className="dashboard-link" data-testid="link-dashboard-prospection"><span className="dashboard-link-icon"><Target size={16} /></span><span className="dashboard-link-copy"><strong>Suivre une opportunité</strong><span>Une étape claire par contact</span></span><ArrowRight size={14} /></Link>
          <Link href="/crm" className="dashboard-link" data-testid="link-dashboard-crm"><span className="dashboard-link-icon"><ContactRound size={16} /></span><span className="dashboard-link-copy"><strong>Ouvrir le CRM</strong><span>Votre liste de relations professionnelles</span></span><ArrowRight size={14} /></Link>
          <Link href="/conversations" className="dashboard-link" data-testid="link-dashboard-conversations"><span className="dashboard-link-icon"><MessageSquareText size={16} /></span><span className="dashboard-link-copy"><strong>Noter un suivi</strong><span>Rappels manuels, sans boîte de réception</span></span><ArrowRight size={14} /></Link>
          <Link href="/campagnes" className="dashboard-link" data-testid="link-dashboard-campaigns"><span className="dashboard-link-icon"><Workflow size={16} /></span><span className="dashboard-link-copy"><strong>Planifier une campagne</strong><span>Un plan, jamais un lancement automatique</span></span><ArrowRight size={14} /></Link>
        </div>
      </section>
    </div>
    <div className="foundation-note" data-testid="status-control-note"><span>MarketPilot organise votre travail ; rien n’est envoyé, importé ou publié sans votre action explicite.</span></div>
  </div></AppFrame>;
}
