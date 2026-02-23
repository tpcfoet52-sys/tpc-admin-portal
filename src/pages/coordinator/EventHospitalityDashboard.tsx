import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus, Calendar, MapPin, Trash2, Users,
  Loader2, ArrowLeft, Download, Phone, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useLogout } from "@/hooks/useLogout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Form Schema for Creating Event ---
const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  event_date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  banner_url: z.string().optional(),
});

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  banner_url?: string;
  status: 'pending' | 'approved' | 'deletion_requested';
}

interface Registration {
  id: number;
  student_name: string;
  student_email: string;
  student_roll: string;
  branch: string;
  mobile_number: string;
  student_year?: string;
}

const EventHospitalityDashboard = () => {
  const { logout } = useLogout();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", description: "", event_date: "", location: "", banner_url: "" },
  });

  // --- Fetch Events ---
  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  // --- Create Event ---
  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      let bannerUrl = "";

      // 1. Upload Banner if exists
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event-banners')
          .upload(fileName, bannerFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload banner image");
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('event-banners')
          .getPublicUrl(fileName);

        bannerUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Event into Database
      const { error } = await supabase.from('events').insert([{
        ...values,
        banner_url: bannerUrl,
        status: 'pending' // Default status
      }]);

      if (error) throw error;
      toast.success("Event created! Waiting for Admin approval.");

      // Cleanup
      setIsCreateOpen(false);
      setBannerFile(null);
      form.reset();
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    }
  };

  // --- Request Deletion ---
  const requestDeletion = async (id: number) => {
    if (!confirm("Are you sure? Admin approval required to delete.")) return;

    const { error } = await supabase
      .from('events')
      .update({ status: 'deletion_requested' })
      .eq('id', id);

    if (error) toast.error("Failed to request deletion");
    else {
      toast.success("Deletion requested sent to Admin");
      fetchEvents();
    }
  };

  // --- Fetch Registrations for an Event ---
  const viewRegistrations = async (eventId: number) => {
    setSelectedEventId(eventId);
    setLoadingRegs(true);
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId);

    if (!error && data) setRegistrations(data);
    setLoadingRegs(false);
  };

  // --- Download CSV Handler ---
  const downloadCSV = () => {
    if (!registrations.length) {
      toast.error("No registrations to download");
      return;
    }

    const headers = ["Student Name", "Email", "Mobile Number", "Roll Number", "Branch", "Year"];

    const csvContent = [
      headers.join(","),
      ...registrations.map(reg => [
        `"${reg.student_name}"`,
        `"${reg.student_email}"`,
        `"${reg.mobile_number || 'N/A'}"`,
        `"${reg.student_roll}"`,
        `"${reg.branch}"`,
        `"${reg.student_year || 'N/A'}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations_event_${selectedEventId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started");
  };

  return (
    // FIXED: Added pt-20 (mobile) and md:pt-28 (desktop)
    <div className="min-h-screen bg-background pt-20 px-4 pb-8 md:pt-28 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/team-structure" className="flex items-center text-muted-foreground hover:text-accent transition-colors mb-3 text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Team
          </Link>
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Coordinator Panel</span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mt-1">
            Event <span className="text-gold-gradient">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Manage events and view student registrations.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border hover:border-accent/30 hover:text-accent transition-all" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="h-4 w-4" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Event will be visible after Admin approval.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">

                  {/* File Upload Input */}
                  <div className="space-y-2">
                    <FormLabel>Event Banner (Optional)</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended size: 1200x600px. Max 5MB.</p>
                  </div>

                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="e.g. Annual Tech Fest" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="event_date" render={({ field }) => (
                    <FormItem><FormLabel>Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g. Auditorium" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Event details..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" variant="navy" className="w-full">Submit for Approval</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Events List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">Your <span className="text-gold-gradient">Events</span></h2>
          {isLoading ? <Loader2 className="animate-spin" /> : events.length === 0 ? <p className="text-muted-foreground">No events found.</p> : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id} className={`bg-card border border-border/50 rounded-xl transition-all duration-300 hover:shadow-md hover:border-accent/30 ${selectedEventId === event.id ? 'ring-2 ring-accent' : ''}`}>
                  <div className="flex flex-col md:flex-row">
                    {/* Small thumbnail in dashboard view */}
                    {event.banner_url && (
                      <div className="w-full md:w-32 h-32 md:h-auto bg-muted flex-shrink-0">
                        <img src={event.banner_url} alt="Banner" className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="font-serif">{event.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" /> {new Date(event.event_date).toLocaleString()}
                              <MapPin className="h-3 w-3 ml-2" /> {event.location}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            event.status === 'approved' ? 'default' :
                              event.status === 'deletion_requested' ? 'destructive' : 'secondary'
                          }>
                            {event.status === 'deletion_requested' ? 'Delete Requested' : event.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button
                          variant="outline" size="sm"
                          onClick={() => viewRegistrations(event.id)}
                          disabled={event.status !== 'approved'}
                        >
                          <Users className="h-4 w-4 mr-2" /> View Registrations
                        </Button>

                        {event.status !== 'deletion_requested' && (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => requestDeletion(event.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Request Delete
                          </Button>
                        )}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Registrations View */}
        <div className="lg:col-span-1">
          {/* FIXED: Changed from top-8 to top-28 to clear the fixed header */}
          <Card className="h-full sticky top-28 flex flex-col bg-card border border-border/50 rounded-xl">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif">Student <span className="text-gold-gradient">Registrations</span></CardTitle>
                {selectedEventId && registrations.length > 0 && (
                  <Button variant="outline" size="icon" onClick={downloadCSV} title="Download CSV">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>
                {selectedEventId ? "Showing registered students" : "Select an approved event to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              {!selectedEventId ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-6 text-center">
                  <Users className="h-10 w-10 mb-2 opacity-20" />
                  <p>Select an event from the list to view attendee data.</p>
                </div>
              ) : loadingRegs ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
              ) : registrations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No registrations yet.</div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">
                            {reg.student_name}
                            <div className="text-xs text-muted-foreground">{reg.student_roll}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-medium">{reg.branch} {reg.student_year ? `(${reg.student_year})` : ''}</div>
                            <div className="text-xs text-muted-foreground">{reg.student_email}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" /> {reg.mobile_number || 'N/A'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventHospitalityDashboard;