import { supabase } from '@/lib/supabase/client';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'customer'
  | 'archived';

export type DraftStatus = 'draft' | 'planned';
export type CampaignStatus = 'draft' | 'planned' | 'paused' | 'archived';
export type FollowUpStatus = 'pending' | 'done';

export type Lead = {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type LeadInput = Omit<
  Lead,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type MarketingDraft = {
  id: string;
  user_id: string;
  title: string;
  channel: string;
  objective: string;
  content: string;
  status: DraftStatus;
  planned_for: string | null;
  created_at: string;
  updated_at: string;
};

export type MarketingDraftInput = Omit<
  MarketingDraft,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type Campaign = {
  id: string;
  user_id: string;
  name: string;
  channel: string;
  objective: string;
  audience: string;
  status: CampaignStatus;
  starts_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CampaignInput = Omit<
  Campaign,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type FollowUp = {
  id: string;
  user_id: string;
  lead_id: string | null;
  subject: string;
  notes: string;
  follow_up_at: string | null;
  status: FollowUpStatus;
  created_at: string;
  updated_at: string;
};

export type FollowUpInput = Omit<
  FollowUp,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

export type WorkspaceSettings = {
  user_id: string;
  business_name: string;
  target_audience: string;
  primary_offer: string;
  business_goal: string;
  updated_at: string;
};

export type WorkspaceSettingsInput = Omit<WorkspaceSettings, 'user_id' | 'updated_at'>;

export class DataAccessError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'DataAccessError';
  }
}

function getClient() {
  if (!supabase) {
    throw new DataAccessError(
      'Supabase n’est pas configuré. Ajoutez les variables publiques VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  return supabase;
}

function throwIfError(error: { message: string; code?: string } | null) {
  if (!error) return;
  if (error.code === '42P01' || error.code === 'PGRST205') {
    throw new DataAccessError(
      'Les tables MarketPilot ne sont pas encore installées dans Supabase. Appliquez la migration locale la plus récente dans SQL Editor.',
      error.code,
    );
  }
  if (error.code === '42501' || error.code === 'PGRST301') {
    throw new DataAccessError(
      'Accès refusé par Supabase. Vérifiez la session et les politiques de sécurité RLS.',
      error.code,
    );
  }
  throw new DataAccessError(error.message, error.code);
}

async function listRows<T>(table: string): Promise<T[]> {
  const { data, error } = await getClient()
    .from(table)
    .select('*')
    .order('updated_at', { ascending: false });
  throwIfError(error);
  return (data ?? []) as T[];
}

async function saveRow<T>(
  table: string,
  input: object,
  id?: string,
): Promise<T> {
  const client = getClient();
  const query = id
    ? client.from(table).update(input).eq('id', id)
    : client.from(table).insert(input);
  const { data, error } = await query.select('*').single();
  throwIfError(error);
  return data as T;
}

async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await getClient().from(table).delete().eq('id', id);
  throwIfError(error);
}

export const marketpilotData = {
  leads: {
    list: () => listRows<Lead>('marketpilot_leads'),
    save: (input: LeadInput, id?: string) =>
      saveRow<Lead>('marketpilot_leads', input, id),
    delete: (id: string) => deleteRow('marketpilot_leads', id),
  },
  drafts: {
    list: () => listRows<MarketingDraft>('marketpilot_marketing_drafts'),
    save: (input: MarketingDraftInput, id?: string) =>
      saveRow<MarketingDraft>('marketpilot_marketing_drafts', input, id),
    delete: (id: string) => deleteRow('marketpilot_marketing_drafts', id),
  },
  campaigns: {
    list: () => listRows<Campaign>('marketpilot_campaigns'),
    save: (input: CampaignInput, id?: string) =>
      saveRow<Campaign>('marketpilot_campaigns', input, id),
    delete: (id: string) => deleteRow('marketpilot_campaigns', id),
  },
  followUps: {
    list: () => listRows<FollowUp>('marketpilot_follow_ups'),
    save: (input: FollowUpInput, id?: string) =>
      saveRow<FollowUp>('marketpilot_follow_ups', input, id),
    delete: (id: string) => deleteRow('marketpilot_follow_ups', id),
  },
  settings: {
    async get(): Promise<WorkspaceSettings | null> {
      const { data, error } = await getClient()
        .from('marketpilot_workspace_settings')
        .select('*')
        .maybeSingle();
      throwIfError(error);
      return data as WorkspaceSettings | null;
    },
    async save(input: WorkspaceSettingsInput): Promise<WorkspaceSettings> {
      const { data, error } = await getClient()
        .from('marketpilot_workspace_settings')
        .upsert(input, { onConflict: 'user_id' })
        .select('*')
        .single();
      throwIfError(error);
      return data as WorkspaceSettings;
    },
  },
};

export const marketpilotQueryKeys = {
  all: ['marketpilot'] as const,
  leads: () => [...marketpilotQueryKeys.all, 'leads'] as const,
  drafts: () => [...marketpilotQueryKeys.all, 'drafts'] as const,
  campaigns: () => [...marketpilotQueryKeys.all, 'campaigns'] as const,
  followUps: () => [...marketpilotQueryKeys.all, 'follow-ups'] as const,
  settings: () => [...marketpilotQueryKeys.all, 'settings'] as const,
};
