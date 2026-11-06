import { useMemo, useState, type FormEvent } from 'react';
import { FileText, Plus, Search, Pencil, Trash2, X, RotateCw } from 'lucide-react';
import type { Lead } from '@/lib/data/marketpilot';
import { AppFrame } from '@/components/app-frame';

export type ResourceField = { key: string; label: string; type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select'; options?: { value: string; label: string }[]; nullable?: boolean; required?: boolean; full?: boolean; placeholder?: string };
export type ResourceRecord = Record<string, any> & { id: string };
type ResourceManagerProps = {
  title: string; eyebrow: string; subtitle: string; resourceLabel: string; records: ResourceRecord[] | undefined;
  isLoading: boolean; error: Error | null; onRetry: () => void; onSave: (input: Record<string, unknown>, id?: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>; fields: ResourceField[]; statusField: string; statusOptions: { value: string; label: string }[];
  recordName: (record: ResourceRecord) => string; recordDescription: (record: ResourceRecord) => string;
  info?: string; leads?: Lead[]; emptyCopy?: string;
};

const dateValue = (value: unknown) => {
  if (!value || typeof value !== 'string') return '';
  return value.length > 10 ? value.slice(0, 16) : value;
};

export function ResourceManager(props: ResourceManagerProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<ResourceRecord | null | undefined>(undefined);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const filtered = useMemo(() => (props.records ?? []).filter((record) => {
    const matchesText = Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(search.toLowerCase()));
    return matchesText && (filter === 'all' || record[props.statusField] === filter);
  }), [props.records, search, filter, props.statusField]);

  function openEditor(record?: ResourceRecord) {
    setFeedback(null);
    setEditing(record ?? null);
    const next: Record<string, string> = {};
    props.fields.forEach((field) => {
      const raw = record?.[field.key];
      next[field.key] = field.type === 'date' ? dateValue(raw) : raw == null ? '' : String(raw);
    });
    setValues(next);
  }
  function closeEditor() { setEditing(undefined); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    const payload: Record<string, unknown> = {};
    props.fields.forEach((field) => {
      const value = values[field.key] ?? '';
      if (field.type === 'date') payload[field.key] = value ? new Date(value).toISOString() : null;
      else if (field.nullable) payload[field.key] = value || null;
      else payload[field.key] = value;
    });
    if (props.statusField && !payload[props.statusField]) payload[props.statusField] = props.statusOptions[0]?.value ?? '';
    try {
      await props.onSave(payload, editing?.id);
      setEditing(undefined);
      setFeedback({ type: 'success', text: editing ? `${props.resourceLabel} modifié${props.resourceLabel.endsWith('e') ? 'e' : ''}.` : `${props.resourceLabel} enregistré${props.resourceLabel.endsWith('e') ? 'e' : ''}.` });
    } catch (error) {
      setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Enregistrement impossible. Réessayez.' });
    } finally { setSaving(false); }
  }
  async function remove(record: ResourceRecord) {
    if (!window.confirm(`Supprimer « ${props.recordName(record)} » ? Cette action est définitive.`)) return;
    setDeletingId(record.id); setFeedback(null);
    try { await props.onDelete(record.id); setFeedback({ type: 'success', text: `${props.resourceLabel} supprimé.` }); }
    catch (error) { setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Suppression impossible. Réessayez.' }); }
    finally { setDeletingId(null); }
  }
  async function changeStatus(record: ResourceRecord, status: string) {
    try {
      const payload: Record<string, unknown> = {};
      props.fields.forEach((field) => {
        const current = record[field.key];
        payload[field.key] = current ?? (field.nullable ? null : '');
      });
      payload[props.statusField] = status;
      await props.onSave(payload, record.id);
      setFeedback({ type: 'success', text: 'Étape mise à jour.' });
    } catch (error) { setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Mise à jour impossible.' }); }
  }
  const isError = Boolean(props.error);

  return <AppFrame title={props.title}>
    <div className="main-content">
      <div className="page-heading-row">
        <div><div className="eyebrow">{props.eyebrow}</div><h1 className="page-title">{props.title}</h1><p className="page-subtitle">{props.subtitle}</p></div>
        <button type="button" className="action-button" onClick={() => openEditor()} data-testid={`button-create-${props.resourceLabel.toLowerCase()}`}><Plus size={15} /> Ajouter</button>
      </div>
      {props.info && <div className="module-explainer" data-testid="notice-scope">{props.info}</div>}
      {feedback && <div className={feedback.type === 'success' ? 'inline-notice' : 'inline-error'} role={feedback.type === 'error' ? 'alert' : 'status'} data-testid={`status-${feedback.type}`}>{feedback.text}</div>}
      <div className="toolbar">
        <label className="search-field"><Search size={15} /><input className="control-input" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Rechercher ${props.resourceLabel.toLowerCase()}…`} aria-label={`Rechercher ${props.resourceLabel.toLowerCase()}`} data-testid="input-search" /></label>
        <select className="control-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrer par étape" data-testid="select-filter-status">
          <option value="all">Toutes les étapes</option>{props.statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
      </div>
      <section className="list-card" aria-label={`Liste : ${props.title}`}>
        <div className="list-topline"><span>{isError ? 'Données indisponibles' : `${filtered.length} ${filtered.length === 1 ? props.resourceLabel : `${props.resourceLabel}s`}`}</span><span>Enregistré dans votre espace</span></div>
        {props.isLoading ? <div className="loading-state" role="status" data-testid="status-loading"><div className="skeleton-lines"><span /><span /><span /></div></div>
          : isError ? <div className="error-state" role="alert" data-testid="status-error"><div className="empty-state-inner"><h3>Impossible de charger les données</h3><p>{props.error?.message ?? 'Une erreur est survenue lors de la lecture de Supabase.'}</p><button type="button" className="quiet-button" onClick={props.onRetry} data-testid="button-retry"><RotateCw size={14} /> Réessayer</button></div></div>
            : filtered.length === 0 ? <div className="empty-state" data-testid="status-empty"><div className="empty-state-inner"><span className="empty-mark"><FileText size={19} /></span><h3>{search || filter !== 'all' ? 'Aucun résultat pour ces critères' : `Votre espace ${props.title.toLowerCase()} est prêt`}</h3><p>{search || filter !== 'all' ? 'Essayez une autre recherche ou réinitialisez le filtre.' : (props.emptyCopy ?? `Ajoutez votre premier élément pour commencer. Vos données resteront sous votre contrôle.`)}</p>{!search && filter === 'all' && <button type="button" className="quiet-button" onClick={() => openEditor()} data-testid="button-empty-create"><Plus size={14} /> Créer {props.resourceLabel}</button>}</div></div>
              : <div className="record-list">{filtered.map((record) => <article className="record-row" key={record.id} data-testid={`row-record-${record.id}`}>
                <div className="record-main"><h3 className="record-title">{props.recordName(record) || 'Sans titre'}</h3><div className="record-meta">{props.recordDescription(record)}</div>{record.notes && <p className="record-note">{record.notes}</p>}</div>
                <div className="record-side">
                  <select className="control-select select-compact" value={record[props.statusField] ?? props.statusOptions[0]?.value} aria-label={`Étape pour ${props.recordName(record)}`} onChange={(event) => void changeStatus(record, event.target.value)} data-testid={`select-status-${record.id}`}>
                    {props.statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                  <div className="row-actions"><button type="button" className="icon-button" aria-label={`Modifier ${props.recordName(record)}`} title="Modifier" onClick={() => openEditor(record)} data-testid={`button-edit-${record.id}`}><Pencil size={15} /></button><button type="button" className="icon-button" aria-label={`Supprimer ${props.recordName(record)}`} title="Supprimer" disabled={deletingId === record.id} onClick={() => void remove(record)} data-testid={`button-delete-${record.id}`}><Trash2 size={15} /></button></div>
                </div>
              </article>)}</div>}
      </section>
      {editing !== undefined && <div className="dialog-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
        <section className="editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title">
          <div className="dialog-head"><div><h2 id="editor-title">{editing ? `Modifier ${props.resourceLabel}` : `Ajouter ${props.resourceLabel}`}</h2><p>Les modifications sont enregistrées dans votre espace MarketPilot.</p></div><button type="button" className="icon-button" aria-label="Fermer" onClick={closeEditor} data-testid="button-close-editor"><X size={17} /></button></div>
          <form onSubmit={(event) => void submit(event)}><div className="field-grid">
            {props.fields.map((field) => <label key={field.key} className={`form-field${field.full || field.type === 'textarea' ? ' full' : ''}`}>{field.label}
              {field.type === 'textarea' ? <textarea className="control-textarea" value={values[field.key] ?? ''} placeholder={field.placeholder} required={field.required} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} data-testid={`input-${field.key}`} />
                : field.type === 'select' ? <select className="control-select" value={values[field.key] ?? ''} required={field.required} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} data-testid={`input-${field.key}`}><option value="">Choisir…</option>{(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                  : field.key === 'lead_id' ? <select className="control-select" value={values[field.key] ?? ''} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} data-testid={`input-${field.key}`}><option value="">Aucun contact associé</option>{(props.leads ?? []).map((lead) => <option key={lead.id} value={lead.id}>{lead.name}{lead.company ? ` · ${lead.company}` : ''}</option>)}</select>
                    : <input className="control-input" type={field.type === 'date' ? 'datetime-local' : field.type ?? 'text'} value={values[field.key] ?? ''} placeholder={field.placeholder} required={field.required} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} data-testid={`input-${field.key}`} />}
            </label>)}
          </div><div className="dialog-actions"><button type="button" className="quiet-button" onClick={closeEditor} data-testid="button-cancel-editor">Annuler</button><button type="submit" className="action-button" disabled={saving} data-testid="button-save-record">{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div></form>
        </section>
      </div>}
    </div>
  </AppFrame>;
}
