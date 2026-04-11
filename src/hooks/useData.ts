import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Client = Tables<'clients'>;
type Trip = Tables<'trips'>;
type Item = Tables<'items'>;
type Payment = Tables<'payments'>;
type Doc = Tables<'documents'>;
type KeyDate = Tables<'key_dates'>;
type FollowUp = Tables<'follow_ups'>;
type TripClient = Tables<'trip_clients'>;

export function useClients() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').order('name');
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user,
  });
}

export function useTrips() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase.from('trips').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!user,
  });
}

export function useItems(tripId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['items', tripId],
    queryFn: async () => {
      let q = supabase.from('items').select('*');
      if (tripId) q = q.eq('trip_id', tripId);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Item[];
    },
    enabled: !!user,
  });
}

export function usePayments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });
}

export function useDocuments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
      if (error) throw error;
      return data as Doc[];
    },
    enabled: !!user,
  });
}

export function useKeyDates() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['key_dates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('key_dates').select('*').order('date');
      if (error) throw error;
      return data as KeyDate[];
    },
    enabled: !!user,
  });
}

export function useFollowUps() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['follow_ups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('follow_ups').select('*').order('due_date');
      if (error) throw error;
      return data as FollowUp[];
    },
    enabled: !!user,
  });
}

export function useTripClients(tripId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['trip_clients', tripId],
    queryFn: async () => {
      let q = supabase.from('trip_clients').select('*');
      if (tripId) q = q.eq('trip_id', tripId);
      const { data, error } = await q;
      if (error) throw error;
      return data as TripClient[];
    },
    enabled: !!user,
  });
}

// Mutations
export function useAddClient() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (client: Omit<TablesInsert<'clients'>, 'user_id'>) => {
      const { data, error } = await supabase.from('clients').insert({ ...client, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useAddTrip() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (trip: Omit<TablesInsert<'trips'>, 'user_id'>) => {
      const { data, error } = await supabase.from('trips').insert({ ...trip, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useAddItem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (item: Omit<TablesInsert<'items'>, 'user_id'>) => {
      const { data, error } = await supabase.from('items').insert({ ...item, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useAddPayment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payment: Omit<TablesInsert<'payments'>, 'user_id'>) => {
      const { data, error } = await supabase.from('payments').insert({ ...payment, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  });
}

export function useAddKeyDate() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (kd: Omit<TablesInsert<'key_dates'>, 'user_id'>) => {
      const { data, error } = await supabase.from('key_dates').insert({ ...kd, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['key_dates'] }),
  });
}

export function useAddFollowUp() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (fu: Omit<TablesInsert<'follow_ups'>, 'user_id'>) => {
      const { data, error } = await supabase.from('follow_ups').insert({ ...fu, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['follow_ups'] }),
  });
}

export function useToggleFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from('follow_ups').update({ completed }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['follow_ups'] }),
  });
}
