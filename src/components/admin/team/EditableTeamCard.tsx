import { Trash2, Edit2, Mail, Linkedin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMember } from "@/types/team";
import { cn } from "@/lib/utils";

interface EditableTeamCardProps {
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onDelete: (id: number) => void;
    className?: string;
}

export const EditableTeamCard = ({ member, onEdit, onDelete, className }: EditableTeamCardProps) => {
    return (
        <div className={cn("relative group flex flex-col items-center p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all", className)}>
            {/* Overlay Controls */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-sm"
                    onClick={() => onEdit(member)}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-sm"
                    onClick={() => onDelete(member.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <Avatar className="w-20 h-20 border-2 border-primary/10 shadow-sm mb-3 cursor-pointer" onClick={() => onEdit(member)}>
                <AvatarImage src={member.image} className={cn("object-cover", member.image_position || "")} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
            </Avatar>

            <div className="text-center w-full space-y-1 mb-3">
                <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-1" title={member.name}>
                    {member.name}
                </h4>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide line-clamp-1" title={member.role}>
                    {member.role}
                </p>
                {/* Faculty specific */}
                {member.title && (
                    <p className="text-[10px] text-muted-foreground">{member.title}</p>
                )}

                {/* Student specific */}
                {(member.branch || member.year) && (
                    <span className="inline-block px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-semibold rounded-full mt-1">
                        {member.year} {member.year && member.branch && "•"} {member.branch}
                    </span>
                )}
            </div>

            {/* Social Links Preview */}
            <div className="flex items-center gap-2 mt-auto justify-center w-full opacity-60">
                {member.phone && <Phone className="w-3 h-3" />}
                {member.email && <Mail className="w-3 h-3" />}
                {member.linkedin && <Linkedin className="w-3 h-3" />}
            </div>
        </div>
    );
};
