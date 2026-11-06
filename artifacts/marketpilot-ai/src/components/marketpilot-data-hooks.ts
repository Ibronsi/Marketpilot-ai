import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  marketpilotData,
  marketpilotQueryKeys,
  type CampaignInput,
  type FollowUpInput,
  type LeadInput,
  type MarketingDraftInput,
  type WorkspaceSettingsInput,
} from '@/lib/data/marketpilot';

export function useLeads() {
  return useQuery({ queryKey: marketpilotQueryKeys.leads(), queryFn: marketpilotData.leads.list, refetchOnMount: 'always' });
}
export function useDrafts() {
  return useQuery({ queryKey: marketpilotQueryKeys.drafts(), queryFn: marketpilotData.drafts.list, refetchOnMount: 'always' });
}
export function useCampaigns() {
  return useQuery({ queryKey: marketpilotQueryKeys.campaigns(), queryFn: marketpilotData.campaigns.list, refetchOnMount: 'always' });
}
export function useFollowUps() {
  return useQuery({ queryKey: marketpilotQueryKeys.followUps(), queryFn: marketpilotData.followUps.list, refetchOnMount: 'always' });
}
export function useWorkspaceSettings() {
  return useQuery({ queryKey: marketpilotQueryKeys.settings(), queryFn: marketpilotData.settings.get, refetchOnMount: 'always' });
}

export function useSaveLead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, id }: { input: LeadInput; id?: string }) => marketpilotData.leads.save(input, id),
    onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.leads() }),
  });
}
export function useDeleteLead() {
  const client = useQueryClient();
  return useMutation({ mutationFn: marketpilotData.leads.delete, onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.leads() }) });
}
export function useSaveDraft() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, id }: { input: MarketingDraftInput; id?: string }) => marketpilotData.drafts.save(input, id),
    onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.drafts() }),
  });
}
export function useDeleteDraft() {
  const client = useQueryClient();
  return useMutation({ mutationFn: marketpilotData.drafts.delete, onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.drafts() }) });
}
export function useSaveCampaign() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, id }: { input: CampaignInput; id?: string }) => marketpilotData.campaigns.save(input, id),
    onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.campaigns() }),
  });
}
export function useDeleteCampaign() {
  const client = useQueryClient();
  return useMutation({ mutationFn: marketpilotData.campaigns.delete, onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.campaigns() }) });
}
export function useSaveFollowUp() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, id }: { input: FollowUpInput; id?: string }) => marketpilotData.followUps.save(input, id),
    onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.followUps() }),
  });
}
export function useDeleteFollowUp() {
  const client = useQueryClient();
  return useMutation({ mutationFn: marketpilotData.followUps.delete, onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.followUps() }) });
}
export function useSaveSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: WorkspaceSettingsInput) => marketpilotData.settings.save(input),
    onSuccess: () => client.invalidateQueries({ queryKey: marketpilotQueryKeys.settings() }),
  });
}
