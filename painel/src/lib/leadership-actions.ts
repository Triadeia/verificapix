"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  type CreateMembershipInput,
  type CreateContactInput,
  type MembershipWithStats,
  type Contact,
  type Membership,
  type MembershipsFilter,
} from "@/lib/leadership-types";

// Initialize Supabase client (server-side)
async function getSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error silently (happens during server-side rendering)
          }
        },
      },
    }
  );
}

// ============ INVITATIONS ============

export async function generateInvitationCode(
  organizationId: string,
  intendedRole: string
): Promise<string> {
  const supabase = await getSupabaseClient();

  // Generate unique code
  const code = generateRandomCode(8);

  // Set expiration to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      organization_id: organizationId,
      code,
      intended_role: intendedRole,
      expires_at: expiresAt.toISOString(),
    })
    .select("code")
    .single();

  if (error) throw new Error(`Failed to generate invitation: ${error.message}`);

  return code;
}

// ============ MEMBERSHIPS ============

export async function createMembership(
  organizationId: string,
  input: CreateMembershipInput
): Promise<MembershipWithStats> {
  const supabase = await getSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if membership already exists
  const { data: existing } = await supabase
    .from("memberships")
    .select("id")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .single();

  if (existing) {
    throw new Error("User already has membership in this organization");
  }

  // Create membership
  const { data, error } = await supabase
    .from("memberships")
    .insert({
      user_id: user.id,
      organization_id: organizationId,
      role: input.intended_role || "supporter",
      status: "pending_validation",
      phone: input.phone,
      whatsapp: input.whatsapp,
      bio: input.full_name,
      zone_name: input.zone_name,
      neighborhood: input.neighborhood,
      profile: {
        cpf: null,
        voter_id: null,
        areas_of_influence: [],
        availability: null,
        network_size: 0,
      },
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create membership: ${error.message}`);

  // Enrich with stats
  return enrichMembershipWithStats(data);
}

export async function getMembershipsWithStats(
  organizationId: string,
  filter?: MembershipsFilter
): Promise<MembershipWithStats[]> {
  const supabase = await getSupabaseClient();

  let query = supabase
    .from("memberships")
    .select(
      `
      *,
      contacts:contacts(id, status)
    `
    )
    .eq("organization_id", organizationId);

  // Apply filters
  if (filter?.status) {
    query = query.eq("status", filter.status);
  }

  if (filter?.role) {
    query = query.eq("role", filter.role);
  }

  if (filter?.zone) {
    query = query.eq("zone_name", filter.zone);
  }

  if (filter?.search) {
    query = query.or(
      `phone.ilike.%${filter.search}%,whatsapp.ilike.%${filter.search}%,bio.ilike.%${filter.search}%`
    );
  }

  const { data, error } = await query.order("last_action_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch memberships: ${error.message}`);

  return data.map((m) => enrichMembershipWithStats(m));
}

export async function getMembershipById(
  organizationId: string,
  membershipId: string
): Promise<MembershipWithStats> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("memberships")
    .select(
      `
      *,
      contacts:contacts(id, status)
    `
    )
    .eq("organization_id", organizationId)
    .eq("id", membershipId)
    .single();

  if (error) throw new Error(`Failed to fetch membership: ${error.message}`);

  return enrichMembershipWithStats(data);
}

// ============ CONTACTS ============

export async function createContact(
  organizationId: string,
  membershipId: string,
  input: CreateContactInput
): Promise<Contact> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      organization_id: organizationId,
      owner_membership_id: membershipId,
      full_name: input.full_name,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      zone: input.zone,
      section: input.section,
      neighborhood: input.neighborhood,
      tags: input.tags || [],
      notes: input.notes,
      status: input.status || "new",
      address: {},
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create contact: ${error.message}`);

  return data;
}

export async function createContactBatch(
  organizationId: string,
  membershipId: string,
  contacts: CreateContactInput[]
): Promise<number> {
  const supabase = await getSupabaseClient();

  const data = contacts.map((contact) => ({
    organization_id: organizationId,
    owner_membership_id: membershipId,
    full_name: contact.full_name,
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    email: contact.email,
    zone: contact.zone,
    section: contact.section,
    neighborhood: contact.neighborhood,
    tags: contact.tags || [],
    notes: contact.notes,
    status: contact.status || "new",
    address: {},
  }));

  const { error, data: result } = await supabase
    .from("contacts")
    .insert(data)
    .select("id");

  if (error) throw new Error(`Failed to create batch: ${error.message}`);

  return result?.length || 0;
}

export async function getContactsByMembership(
  organizationId: string,
  membershipId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ data: Contact[]; total: number }> {
  const supabase = await getSupabaseClient();

  // Get total count
  const { count } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("owner_membership_id", membershipId);

  // Get paginated data
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("owner_membership_id", membershipId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`Failed to fetch contacts: ${error.message}`);

  return {
    data,
    total: count || 0,
  };
}

// ============ GOALS ============

export async function setMemberGoal(
  organizationId: string,
  membershipId: string,
  targetValue: number,
  periodStart: string,
  periodEnd: string
): Promise<void> {
  const supabase = await getSupabaseClient();

  // Check if goal exists for this period
  const { data: existing } = await supabase
    .from("goals")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("scope_membership_id", membershipId)
    .eq("period_start", periodStart)
    .eq("period_end", periodEnd)
    .single();

  if (existing) {
    // Update existing goal
    const { error } = await supabase
      .from("goals")
      .update({
        target_value: targetValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) throw new Error(`Failed to update goal: ${error.message}`);
  } else {
    // Create new goal
    const { error } = await supabase
      .from("goals")
      .insert({
        organization_id: organizationId,
        scope_membership_id: membershipId,
        goal_type: "volume",
        target_value: targetValue,
        current_value: 0,
        unit: "contacts",
        period_start: periodStart,
        period_end: periodEnd,
        status: "active",
      });

    if (error) throw new Error(`Failed to create goal: ${error.message}`);
  }
}

// ============ HELPERS ============

function generateRandomCode(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface MembershipData {
  id: string;
  [key: string]: any;
  contacts?: { id: string; status: string }[];
}

function enrichMembershipWithStats(membership: MembershipData): MembershipWithStats {
  const contacts = membership.contacts || [];

  return {
    ...membership,
    contacts_count: contacts.length,
    confirmed_voters_count: contacts.filter((c) => c.status === "confirmed_voter").length,
    committed_count: contacts.filter((c) => c.status === "committed").length,
    engagement_score: contacts.length > 0 ? Math.min(contacts.length / 50, 1) : 0,
    days_since_last_action: membership.last_action_at
      ? Math.floor(
          (new Date().getTime() - new Date(membership.last_action_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null,
    subordinates_count: 0, // Will be calculated from path if needed
  };
}

// Update last action timestamp (call this after any member activity)
export async function recordMemberActivity(
  organizationId: string,
  membershipId: string
): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from("memberships")
    .update({
      last_action_at: new Date().toISOString(),
    })
    .eq("organization_id", organizationId)
    .eq("id", membershipId);

  if (error) console.error("Failed to record activity:", error);
}
