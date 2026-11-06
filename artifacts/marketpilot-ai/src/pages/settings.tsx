import { useEffect, useState, type FormEvent } from 'react';
import { Check, Database, RotateCw, Save, ShieldCheck } from 'lucide-react';
import { AppFrame } from '@/components/app-frame';
import { useSaveSettings, useWorkspaceSettings } from '@/components/marketpilot-data-hooks';

type SettingsForm = { business_name: string; target_audience: string; primary_offer: string; business_goal: string };
const blankSettings: SettingsForm = { business_name: '', target_audience: '', primary_offer: '', business_goal: '' };

export default function SettingsPage() {
  const query = useWorkspaceSettings();
  const mutation = useSaveSettings();
  const [values, setValues] = useState<SettingsForm>(blankSettings);
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.isLoading && !query.error && !initialized) {
      setValues(query.data ? {
        business_name: query.data.business_name ?? '',
        target_audience: query.data.target_audience ?? '',
        primary_offer: query.data.primary_offer ?? '',
        business_goal: query.data.business_goal ?? '',
      } : blankSettings);
      setInitialized(true);
    }
  }, [query.data, query.error, query.isLoading, initialized]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitError(null); setSaved(false);
    try { await mutation.mutateAsync(values); setSaved(true); }
    catch (error) { setSubmitError(error instanceof Error ? error.message : 'Enregistrement impossible. Réessayez.'); }
  }
  const update = (key: keyof SettingsForm, value: string) => setValues((current) => ({ ...current, [key]: value }));

  return <AppFrame title="Paramètres"><div className="main-content">
    <div className="page-heading-row"><div><div className="eyebrow">Votre espace, vos choix</div><h1 className="page-title">Paramètres</h1><p className="page-subtitle">Quelques repères sur votre activité pour garder votre espace pertinent.</p></div></div>
    {query.isLoading ? <section className="list-card loading-state" role="status" data-testid="status-loading"><div className="skeleton-lines"><span /><span /><span /></div></section>
      : query.error ? <section className="error-state list-card" role="alert" data-testid="status-error"><div className="empty-state-inner"><h3>Les paramètres ne sont pas accessibles</h3><p>{query.error.message}</p><button type="button" className="quiet-button" onClick={() => void query.refetch()} data-testid="button-retry"><RotateCw size={14} /> Réessayer</button></div></section>
        : <div className="settings-layout">
          <section className="list-card"><div className="list-topline"><span>Profil de l’entreprise</span><span>Enregistré dans Supabase</span></div>
            <form className="settings-form" onSubmit={(event) => void submit(event)}>
              {saved && <div className="inline-notice" role="status" data-testid="status-success">Vos préférences ont été enregistrées.</div>}
              {submitError && <div className="inline-error" role="alert" data-testid="status-submit-error">{submitError}</div>}
              <label className="form-field">Nom de l’entreprise<input className="control-input" value={values.business_name} onChange={(event) => update('business_name', event.target.value)} placeholder="Votre nom d’entreprise" data-testid="input-business-name" /></label>
              <label className="form-field">Audience cible<textarea className="control-textarea" value={values.target_audience} onChange={(event) => update('target_audience', event.target.value)} placeholder="À qui souhaitez-vous vous adresser ?" data-testid="input-target-audience" /></label>
              <label className="form-field">Offre principale<textarea className="control-textarea" value={values.primary_offer} onChange={(event) => update('primary_offer', event.target.value)} placeholder="Quel produit ou service proposez-vous ?" data-testid="input-primary-offer" /></label>
              <label className="form-field">Objectif d’activité<textarea className="control-textarea" value={values.business_goal} onChange={(event) => update('business_goal', event.target.value)} placeholder="Quel résultat compte le plus en ce moment ?" data-testid="input-business-goal" /></label>
              <div><button type="submit" className="action-button" disabled={mutation.isPending} data-testid="button-save-settings"><Save size={14} /> {mutation.isPending ? 'Enregistrement…' : 'Enregistrer les paramètres'}</button></div>
            </form>
          </section>
          <aside className="list-card settings-status"><h3>Configuration et données</h3>
            <div className="status-check"><Database size={15} /><span>La lecture des préférences a réussi. La table des paramètres est accessible pour ce compte.</span></div>
            <div className="status-check"><ShieldCheck size={15} /><span>Votre session Supabase gère l’identité et l’accès. Aucun identifiant utilisateur n’est demandé ici.</span></div>
            <div className="status-check"><Check size={15} /><span>Vos préférences sont sauvegardées uniquement après votre action.</span></div>
            <p className="settings-foot">Si une table n’est pas encore installée, le message d’erreur Supabase apparaîtra ici. Appliquez la migration locale indiquée par ce message, puis réessayez. Aucune donnée de démonstration ni copie locale n’est utilisée.</p>
          </aside>
        </div>}
  </div></AppFrame>;
}
