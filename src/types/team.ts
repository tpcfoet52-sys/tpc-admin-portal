export type TeamGroupType = 'faculty' | 'lead' | 'team';

export interface TeamGroup {
    id: number;
    name: string;
    type: TeamGroupType;
    description?: string;
    icon?: string;
    order_index: number;
    stats?: { label: string; value: string }[];
    key_points?: string[];
    created_at?: string;
}

export interface TeamMember {
    id: number;
    group_id: number;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    twitter?: string;
    image?: string;
    branch?: string;
    year?: string;
    title?: string;
    image_position?: string;
    order_index: number;
    created_at?: string;
}

export interface TeamGroupWithMembers extends TeamGroup {
    members: TeamMember[];
}
