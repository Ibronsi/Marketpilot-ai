import { useDrafts, useSaveDraft, useDeleteDraft, useLeads, useSaveLead, useDeleteLead, useCampaigns, useSaveCampaign, useDeleteCampaign, useFollowUps, useSaveFollowUp, useDeleteFollowUp } from '@/components/marketpilot-data-hooks';
import type { CampaignInput, FollowUpInput, LeadInput, MarketingDraftInput } from '@/lib/data/marketpilot';
import { ResourceManager, type ResourceField, type ResourceRecord } from '@/components/resource-manager';

const draftStatuses = [{ value: 'draft', label: 'Brouillon' }, { value: 'planned', label: 'Planifié' }];
const leadStatuses = [
  { value: 'new', label: 'Nouveau' }, { value: 'contacted', label: 'Contacté' }, { value: 'qualified', label: 'Qualifié' },
  { value: 'customer', label: 'Client' }, { value: 'archived', label: 'Archivé' },
];
const campaignStatuses = [
  { value: 'draft', label: 'Brouillon' }, { value: 'planned', label: 'Planifiée' }, { value: 'paused', label: 'En pause' }, { value: 'archived', label: 'Archivée' },
];
const followUpStatuses = [{ value: 'pending', label: 'À suivre' }, { value: 'done', label: 'Terminé' }];
const draftFields: ResourceField[] = [
  { key: 'title', label: 'Titre', required: true, placeholder: 'Ex. Annonce de lancement' },
  { key: 'channel', label: 'Canal', placeholder: 'Ex. LinkedIn, infolettre' },
  { key: 'objective', label: 'Objectif', placeholder: 'Quel résultat souhaitez-vous ?' },
  { key: 'status', label: 'État', type: 'select', options: draftStatuses },
  { key: 'planned_for', label: 'Date prévue', type: 'date', nullable: true },
  { key: 'content', label: 'Contenu', type: 'textarea', full: true, placeholder: 'Votre brouillon…' },
];
const leadFields: ResourceField[] = [
  { key: 'name', label: 'Nom', required: true }, { key: 'company', label: 'Entreprise', nullable: true },
  { key: 'email', label: 'Courriel', type: 'email', nullable: true }, { key: 'phone', label: 'Téléphone', type: 'tel', nullable: true },
  { key: 'source', label: 'Source', placeholder: 'Ex. Référence, événement' },
  { key: 'status', label: 'Étape', type: 'select', options: leadStatuses },
  { key: 'notes', label: 'Notes', type: 'textarea', full: true },
];
const campaignFields: ResourceField[] = [
  { key: 'name', label: 'Nom de la campagne', required: true }, { key: 'channel', label: 'Canal' },
  { key: 'objective', label: 'Objectif', full: true }, { key: 'audience', label: 'Audience visée', full: true },
  { key: 'status', label: 'État', type: 'select', options: campaignStatuses },
  { key: 'starts_at', label: 'Date de début prévue', type: 'date', nullable: true },
];
const followUpFields: ResourceField[] = [
  { key: 'subject', label: 'Sujet', required: true }, { key: 'lead_id', label: 'Contact lié', nullable: true },
  { key: 'follow_up_at', label: 'Date de rappel', type: 'date', nullable: true },
  { key: 'status', label: 'État', type: 'select', options: followUpStatuses },
  { key: 'notes', label: 'Notes de suivi', type: 'textarea', full: true },
];

function leadDescription(record: ResourceRecord) { return [record.company, record.email, record.phone].filter(Boolean).join(' · ') || 'Aucune coordonnée ajoutée'; }

export function MarketingPage() {
  const query = useDrafts(); const save = useSaveDraft(); const remove = useDeleteDraft();
  return <ResourceManager title="Marketing" eyebrow="Préparer, puis décider" subtitle="Rédigez et organisez vos contenus. Rien n’est publié depuis cet espace." resourceLabel="contenu" records={query.data as unknown as ResourceRecord[] | undefined} isLoading={query.isLoading} error={query.error} onRetry={() => void query.refetch()} onSave={(input, id) => save.mutateAsync({ input: input as MarketingDraftInput, id })} onDelete={(id) => remove.mutateAsync(id)} fields={draftFields} statusField="status" statusOptions={draftStatuses} recordName={(record) => record.title} recordDescription={(record) => [record.channel, record.objective, record.planned_for ? `Prévu le ${new Date(record.planned_for).toLocaleDateString('fr-CA')}` : ''].filter(Boolean).join(' · ')} emptyCopy="Conservez ici des idées et des brouillons, sans publication automatique." />;
}

export function ProspectionPage() {
  const query = useLeads(); const save = useSaveLead(); const remove = useDeleteLead();
  return <ResourceManager title="Prospection" eyebrow="Organiser vos opportunités" subtitle="Gardez les contacts potentiels et leur prochaine étape à portée de main." resourceLabel="prospect" records={query.data as unknown as ResourceRecord[] | undefined} isLoading={query.isLoading} error={query.error} onRetry={() => void query.refetch()} onSave={(input, id) => save.mutateAsync({ input: input as LeadInput, id })} onDelete={(id) => remove.mutateAsync(id)} fields={leadFields} statusField="status" statusOptions={leadStatuses} recordName={(record) => record.name} recordDescription={leadDescription} emptyCopy="Ajoutez un prospect lorsque vous souhaitez suivre une relation commerciale." />;
}

export function CrmPage() {
  const query = useLeads(); const save = useSaveLead(); const remove = useDeleteLead();
  return <ResourceManager title="CRM" eyebrow="Relations, sans friction" subtitle="Une liste de contacts claire, modifiable et sous votre contrôle." resourceLabel="contact" records={query.data as unknown as ResourceRecord[] | undefined} isLoading={query.isLoading} error={query.error} onRetry={() => void query.refetch()} onSave={(input, id) => save.mutateAsync({ input: input as LeadInput, id })} onDelete={(id) => remove.mutateAsync(id)} fields={leadFields} statusField="status" statusOptions={leadStatuses} recordName={(record) => record.name} recordDescription={leadDescription} emptyCopy="Votre liste de contacts est vide. Ajoutez uniquement les relations que vous souhaitez suivre." />;
}

export function CampaignsPage() {
  const query = useCampaigns(); const save = useSaveCampaign(); const remove = useDeleteCampaign();
  return <ResourceManager title="Campagnes" eyebrow="Planifier à votre rythme" subtitle="Clarifiez l’intention et l’audience avant de décider de la suite." resourceLabel="campagne" records={query.data as unknown as ResourceRecord[] | undefined} isLoading={query.isLoading} error={query.error} onRetry={() => void query.refetch()} onSave={(input, id) => save.mutateAsync({ input: input as CampaignInput, id })} onDelete={(id) => remove.mutateAsync(id)} fields={campaignFields} statusField="status" statusOptions={campaignStatuses} recordName={(record) => record.name} recordDescription={(record) => [record.channel, record.objective, record.starts_at ? `Début prévu ${new Date(record.starts_at).toLocaleDateString('fr-CA')}` : ''].filter(Boolean).join(' · ')} info="Ce sont des plans de campagne uniquement. Ils ne sont ni envoyés, ni lancés depuis MarketPilot." emptyCopy="Votre première campagne pourra rester au stade de plan jusqu’à votre décision." />;
}

export function ConversationsPage() {
  const query = useFollowUps(); const leadsQuery = useLeads(); const save = useSaveFollowUp(); const remove = useDeleteFollowUp();
  const names = new Map((leadsQuery.data ?? []).map((lead) => [lead.id, lead.name]));
  return <ResourceManager title="Conversations" eyebrow="Le suivi reste humain" subtitle="Notez un prochain geste et gardez le contexte d’une relation." resourceLabel="note de suivi" records={query.data as unknown as ResourceRecord[] | undefined} isLoading={query.isLoading} error={query.error} onRetry={() => void query.refetch()} onSave={(input, id) => save.mutateAsync({ input: input as FollowUpInput, id })} onDelete={(id) => remove.mutateAsync(id)} fields={followUpFields} statusField="status" statusOptions={followUpStatuses} leads={leadsQuery.data} recordName={(record) => record.subject} recordDescription={(record) => [record.lead_id ? names.get(record.lead_id) ?? 'Contact' : 'Sans contact associé', record.follow_up_at ? `À suivre le ${new Date(record.follow_up_at).toLocaleDateString('fr-CA')}` : 'Sans date'].join(' · ')} info="Ce n’est pas une boîte de réception : MarketPilot n’importe ni n’envoie de messages. Ces notes sont vos rappels manuels." emptyCopy="Ajoutez un rappel écrit pour ne pas perdre le fil d’une conversation." />;
}
