import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Users, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { TeamGroupWithMembers, TeamGroup, TeamMember } from "@/types/team";
import { EditableTeamCard } from "@/components/admin/team/EditableTeamCard";
import { TeamMemberForm } from "@/components/admin/team/TeamMemberForm";
import { TeamGroupForm } from "@/components/admin/team/TeamGroupForm";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type TeamMemberFormValues = Omit<TeamMember, "id" | "group_id" | "created_at">;
type TeamGroupFormValues = Omit<TeamGroup, "id" | "created_at">;

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error && "message" in error) {
        return String((error as { message?: unknown }).message);
    }
    return String(error);
};

const ManageTeam = () => {
    const [groups, setGroups] = useState<TeamGroupWithMembers[]>([]);
    const [loading, setLoading] = useState(true);

    // Forms state
    const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
    const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);
    const [editingGroup, setEditingGroup] = useState<TeamGroup | undefined>(undefined);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch groups
            const { data: groupsData, error: groupsError } = await supabase
                .from("team_groups")
                .select("*")
                .order("order_index");

            if (groupsError) throw groupsError;

            // Fetch members
            const { data: membersData, error: membersError } = await supabase
                .from("team_members")
                .select("*")
                .order("order_index");

            if (membersError) throw membersError;

            // Combine
            const groups = (groupsData ?? []) as TeamGroup[];
            const members = (membersData ?? []) as TeamMember[];
            const combined: TeamGroupWithMembers[] = groups.map((group) => ({
                ...group,
                members: members.filter((member) => member.group_id === group.id)
            }));

            setGroups(combined);
        } catch (error: unknown) {
            toast({ title: "Error fetching data", description: getErrorMessage(error), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers
    const handleAddMember = (groupId: number) => {
        setEditingMember(undefined);
        setSelectedGroupId(groupId);
        setIsMemberFormOpen(true);
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(member);
        setSelectedGroupId(member.group_id);
        setIsMemberFormOpen(true);
    };

    const handleDeleteMember = async (id: number) => {
        if (!confirm("Are you sure you want to delete this member?")) return;
        try {
            const { error } = await supabase.from("team_members").delete().eq("id", id);
            if (error) throw error;
            toast({ title: "Member deleted" });
            fetchData();
        } catch (error: unknown) {
            toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" });
        }
    };

    const handleMemberSubmit = async (values: TeamMemberFormValues) => {
        setIsMemberFormOpen(false); // Close immediately for better UX or wait? Better wait usually but for simplicity
        try {
            if (editingMember) {
                const { error } = await supabase
                    .from("team_members")
                    .update(values)
                    .eq("id", editingMember.id);
                if (error) throw error;
                toast({ title: "Member updated" });
            } else {
                if (!selectedGroupId) return;
                const { error } = await supabase
                    .from("team_members")
                    .insert({ ...values, group_id: selectedGroupId });
                if (error) throw error;
                toast({ title: "Member added" });
            }
            fetchData();
        } catch (error: unknown) {
            toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" });
        }
    };

    // Group Handlers
    const handleAddGroup = () => {
        setEditingGroup(undefined);
        setIsGroupFormOpen(true);
    };

    const handleEditGroup = (group: TeamGroup) => {
        setEditingGroup(group);
        setIsGroupFormOpen(true);
    };

    const handleDeleteGroup = async (id: number) => {
        if (!confirm("Are you sure? This will delete the group AND ALL MEMBERS in it.")) return;
        try {
            const { error } = await supabase.from("team_groups").delete().eq("id", id);
            if (error) throw error;
            toast({ title: "Group deleted" });
            fetchData();
        } catch (error: unknown) {
            toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" });
        }
    };

    const handleGroupSubmit = async (values: TeamGroupFormValues) => {
        setIsGroupFormOpen(false);
        try {
            if (editingGroup) {
                const { error } = await supabase
                    .from("team_groups")
                    .update(values)
                    .eq("id", editingGroup.id);
                if (error) throw error;
                toast({ title: "Group updated" });
            } else {
                const { error } = await supabase
                    .from("team_groups")
                    .insert(values);
                if (error) throw error;
                toast({ title: "Group added" });
            }
            fetchData();
        } catch (error: unknown) {
            toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" });
        }
    };


    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-white">Manage Team</h1>
                    <p className="text-muted-foreground mt-2">Manage faculty, coordinators, and student teams.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => handleAddGroup()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Group
                    </Button>
                </div>
            </div>

            {/* Groups and Members Rendering */}
            {groups.length === 0 ? (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center py-20">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Team Data Found</h3>
                    <p className="text-muted-foreground mb-4">Migrate data or add a new group to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <Accordion type="multiple" defaultValue={groups.map(g => `item-${g.id}`)} className="w-full">
                        {groups.map((group) => (
                            <AccordionItem key={group.id} value={`item-${group.id}`} className="border rounded-lg bg-card px-4 mb-4">
                                <div className="flex items-center justify-between py-2">
                                    <AccordionTrigger className="hover:no-underline flex-1">
                                        <div className="text-left">
                                            <h3 className="font-semibold text-lg text-foreground">{group.name}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">{group.type} Group • {group.members.length} Members</p>
                                        </div>
                                    </AccordionTrigger>
                                    <div className="flex gap-2 ml-4">
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <AccordionContent>
                                    <div className="pt-2 pb-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {/* Add Member Button Card */}
                                            <button
                                                onClick={() => handleAddMember(group.id)}
                                                className="flex flex-col items-center justify-center p-4 h-full min-h-[200px] border-2 border-dashed border-muted-foreground/20 rounded-xl hover:bg-accent/50 hover:border-accent transition-all group"
                                            >
                                                <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-accent group-hover:text-accent-foreground flex items-center justify-center mb-2 transition-colors">
                                                    <Plus className="h-6 w-6" />
                                                </div>
                                                <span className="font-medium text-sm">Add Member</span>
                                            </button>

                                            {group.members.map((member) => (
                                                <EditableTeamCard
                                                    key={member.id}
                                                    member={member}
                                                    onEdit={handleEditMember}
                                                    onDelete={handleDeleteMember}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}

            <TeamMemberForm
                open={isMemberFormOpen}
                onOpenChange={setIsMemberFormOpen}
                onSubmit={handleMemberSubmit}
                initialData={editingMember}
            />

            <TeamGroupForm
                open={isGroupFormOpen}
                onOpenChange={setIsGroupFormOpen}
                onSubmit={handleGroupSubmit}
                initialData={editingGroup}
            />
        </div>
    );
};

export default ManageTeam;
