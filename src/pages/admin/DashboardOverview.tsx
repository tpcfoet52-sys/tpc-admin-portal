import { Link } from 'react-router-dom';
import {
  CheckSquare,
  UserCog,
  Users,
  FileEdit,
  Shield,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const adminAccess = [
  {
    title: 'Approvals',
    href: '/admin/approvals',
    icon: <CheckSquare className="w-5 h-5" />,
    items: [
      'Approve / Reject placement drives, seminars & press releases',
      'Approve / Reject top performer submissions',
      'Handle content deletion requests from coordinators',
    ],
  },
  {
    title: 'Manage Team',
    href: '/admin/team',
    icon: <UserCog className="w-5 h-5" />,
    items: [
      'Add, edit & remove team members',
      'Create & manage team groups / sections',
    ],
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
    items: [
      'Create & delete coordinator accounts',
      'Assign coordinators to teams',
    ],
  },
  {
    title: 'Events',
    href: '/admin/approvals',
    icon: <Calendar className="w-5 h-5" />,
    items: [
      'Approve / Reject event creation requests',
      'Handle event deletion requests',
    ],
  },
  {
    title: 'CMS & Media',
    href: '/admin/cms',
    icon: <FileEdit className="w-5 h-5" />,
    items: [
      'Review & approve media submissions',
    ],
  },
];

const teams = [
  'Corporate Connect',
  'Networking & Outreach',
  'Industry Interface',
  'Web Dev & Design',
  'Content & Media',
  'Event & Hospitality',
];

const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      {/* Header — matches website section headers */}
      <div className="text-center">
        <span className="text-accent font-medium text-sm uppercase tracking-wider">
          Admin Panel
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mt-2">
          Dashboard <span className="text-gold-gradient">Overview</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
          Complete access to manage content, team structure, users, events & media.
        </p>
      </div>

      {/* Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminAccess.map((section) => (
          <div
            key={section.title}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary">{section.icon}</span>
                </div>
                <h3 className="font-serif font-semibold text-foreground text-base">
                  {section.title}
                </h3>
              </div>
              <Link
                to={section.href}
                className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Open <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Capabilities */}
            <ul className="space-y-2 pl-1">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-[7px] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Teams */}
      <div className="bg-muted/30 border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-accent" />
          <span className="font-serif font-semibold text-sm text-foreground">
            Coordinator Teams Under Admin
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <span
              key={team}
              className="inline-block text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-3 py-1.5 rounded-full"
            >
              {team}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;