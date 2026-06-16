// Leadership Management Types

export type OrganizationRole =
  | 'candidate'
  | 'general_coordinator'
  | 'regional_coordinator'
  | 'community_leader'
  | 'captain'
  | 'supporter'
  | 'admin';

export type MembershipStatus =
  | 'invited'
  | 'pending_validation'
  | 'active'
  | 'dormant'
  | 'suspended'
  | 'removed';

export type ContactStatus =
  | 'new'
  | 'contacted'
  | 'sympathizer'
  | 'committed'
  | 'confirmed_voter'
  | 'declined'
  | 'ghost'
  | 'archived';

export type InteractionType =
  | 'visit'
  | 'call'
  | 'whatsapp'
  | 'sms'
  | 'email'
  | 'event'
  | 'registration'
  | 'commitment'
  | 'survey'
  | 'note'
  | 'other';

export type GoalType = 'volume' | 'conversion' | 'geographic' | 'composite';
export type GoalStatus = 'active' | 'achieved' | 'missed' | 'cancelled';
export type TerritoryType = 'state' | 'city' | 'zone' | 'section' | 'neighborhood' | 'street';
export type BroadcastChannel = 'whatsapp' | 'push' | 'sms' | 'email';
export type BroadcastStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

// ============ Organization ============
export interface Organization {
  id: string;
  name: string;
  candidate_name: string;
  election_type: string;
  election_date: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Membership (Líder) ============
export interface Membership {
  id: string;
  user_id: string;
  organization_id: string;
  parent_membership_id: string | null;
  path: string; // ltree path
  role: OrganizationRole;
  status: MembershipStatus;
  territory_ids: string[];
  zone_name: string | null;
  neighborhood: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  bio: string | null;
  profile: Record<string, any>; // cpf, voter_id, areas_of_influence, etc
  consent_terms_at: string | null;
  invited_by_membership_id: string | null;
  promoted_at: string | null;
  activated_at: string | null;
  last_action_at: string | null;
  created_at: string;
  updated_at: string;
}

// Extended Membership with computed fields
export interface MembershipWithStats extends Membership {
  contacts_count?: number;
  committed_count?: number;
  confirmed_voters_count?: number;
  first_action_rate?: number; // % of contacts with at least 1 interaction
  days_since_last_action?: number;
  goal_completion?: number; // %
  subordinates_count?: number;
}

// ============ Contact (Eleitor) ============
export interface Contact {
  id: string;
  organization_id: string;
  owner_membership_id: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  cpf_hash: string | null;
  voter_id_hash: string | null;
  address: Record<string, any>;
  zone: string | null;
  section: string | null;
  neighborhood: string | null;
  status: ContactStatus;
  influence_level: number; // 1-5
  engagement_score: number; // 0-1.0
  tags: string[];
  notes: string | null;
  source_channel: string | null;
  referrer_membership_id: string | null;
  created_at: string;
  last_interaction_at: string | null;
  updated_at: string;
}

// ============ Contact Interaction ============
export interface ContactInteraction {
  id: string;
  contact_id: string;
  membership_id: string;
  interaction_type: InteractionType;
  outcome: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  geo_location: [number, number] | null;
  occurred_at: string;
}

// ============ Goal ============
export interface Goal {
  id: string;
  organization_id: string;
  scope_membership_id: string | null;
  goal_type: GoalType;
  target_value: number;
  current_value: number;
  unit: string;
  period_start: string;
  period_end: string;
  parent_goal_id: string | null;
  status: GoalStatus;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Invitation ============
export interface Invitation {
  id: string;
  organization_id: string;
  invited_by_membership_id: string | null;
  code: string;
  intended_role: OrganizationRole;
  intended_parent_membership_id: string | null;
  target_phone: string | null;
  target_email: string | null;
  expires_at: string;
  accepted_at: string | null;
  accepted_by_user_id: string | null;
  created_at: string;
}

// ============ Territory ============
export interface Territory {
  id: string;
  organization_id: string;
  parent_id: string | null;
  type: TerritoryType;
  code: string | null;
  name: string;
  estimated_voters: number | null;
  target_votes: number | null;
  geo_polygon: any; // PostGIS POLYGON type
  created_at: string;
}

// ============ Badge ============
export interface Badge {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  criteria: Record<string, any>; // JSON criteria for earning
  created_at: string;
}

export interface UserBadge {
  id: string;
  membership_id: string;
  badge_id: string;
  earned_at: string;
}

// ============ Broadcast ============
export interface Broadcast {
  id: string;
  organization_id: string;
  sent_by_membership_id: string | null;
  channel: BroadcastChannel;
  template: string;
  audience_filter: Record<string, any>;
  status: BroadcastStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  sent_count: number;
  opened_count: number;
  click_count: number;
  created_at: string;
}

// ============ Form DTOs ============
export interface CreateMembershipInput {
  phone: string;
  whatsapp: string;
  full_name: string;
  zone_name?: string;
  neighborhood?: string;
  intended_role?: OrganizationRole;
  referral_code?: string;
}

export interface CreateContactInput {
  full_name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  zone?: string;
  section?: string;
  neighborhood?: string;
  tags?: string[];
  notes?: string;
  status?: ContactStatus;
}

export interface UpdateGoalInput {
  target_value: number;
  period_start: string;
  period_end: string;
  description?: string;
}

// ============ Response Types ============
export interface MembershipResponse {
  success: boolean;
  membership?: MembershipWithStats;
  error?: string;
}

export interface ContactResponse {
  success: boolean;
  contact?: Contact;
  error?: string;
}

export interface ListMembershipsResponse {
  data: MembershipWithStats[];
  total: number;
  page: number;
  limit: number;
}

export interface ListContactsResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
}

// ============ Dashboard Stats ============
export interface MembershipStats {
  total_members: number;
  active_members: number;
  new_members_this_week: number;
  members_with_contacts: number;
  avg_contacts_per_member: number;
  avg_engagement_score: number;
  goal_completion_rate: number;
}

export interface LeaderDashboardData {
  membership: MembershipWithStats;
  contacts: Contact[];
  recent_interactions: ContactInteraction[];
  goal: Goal | null;
  badges: UserBadge[];
  stats: {
    total_contacts: number;
    committed_contacts: number;
    confirmed_voters: number;
    last_7_days_activity: number;
    engagement_trend: number[]; // last 7 days
  };
}

// ============ Filter & Sort Types ============
export interface MembershipsFilter {
  organization_id: string;
  role?: OrganizationRole;
  status?: MembershipStatus;
  zone?: string;
  search?: string;
  has_contacts?: boolean;
  last_action_days?: number; // filter by inactivity
}

export interface ContactsFilter {
  organization_id: string;
  owner_membership_id?: string;
  status?: ContactStatus;
  zone?: string;
  section?: string;
  search?: string;
  influence_level_min?: number;
  tags?: string[];
}
