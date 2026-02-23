import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TEAMS = [
  "Content & Media Team",
  "Event & Hospitality Team",
];

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  team_name: z.string().min(1, "Team selection is required"),
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return String(error);
};

interface Coordinator {
  id: string;
  email: string;
  team_name: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<Coordinator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      team_name: "",
    },
  });

  const fetchUsers = async () => {
    try {
      if (!supabase) {
        console.error("Supabase client not initialized");
        toast.error("Database connection not configured");
        setIsLoading(false);
        return;
      }

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Not authenticated");
        setIsLoading(false);
        return;
      }

      // Call Edge Function to list coordinators
      // Call Edge Function to list coordinators
      const { data, error } = await supabase.functions.invoke('list-coordinators', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error from Edge Function:", error);

        // Check for specific error types
        // The Supabase client might wrap the error, so we check the message
        const errorMessage = error.message || JSON.stringify(error);

        if (errorMessage.includes('Invalid JWT') || errorMessage.includes('401')) {
          toast.error("Authentication Error: Please check your API keys in .env file. The Anon Key might be incorrect.");
          console.error("Critical: Invalid JWT Error. Likely incorrect VITE_SUPABASE_ANON_KEY.");
        } else {
          toast.error(errorMessage || "Failed to fetch users");
        }

        throw error;
      }

      setUsers(data.coordinators || []);
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      const message = getErrorMessage(error);
      // specific toast already shown above if applicable
      if (!message.includes('Invalid JWT') && !message.includes('401')) {
        toast.error(message || "Failed to load users");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!supabase) {
        toast.error("Database connection not configured");
        return;
      }

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      // Call Edge Function to create coordinator
      const { data, error } = await supabase.functions.invoke('create-coordinator', {
        body: {
          email: values.email,
          password: values.password,
          team_name: values.team_name,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Coordinator added successfully");
      setIsDialogOpen(false);
      form.reset();
      fetchUsers();
    } catch (error: unknown) {
      console.error("Error adding user:", error);
      const message = getErrorMessage(error);
      if (message.includes("already registered") || message.includes("already exists")) {
        toast.error("Email already registered");
      } else {
        toast.error(message || "Failed to add user. Please try again.");
      }
    }
  };

  const deleteUser = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      if (!supabase) {
        toast.error("Database connection not configured");
        return;
      }

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      // Call Edge Function to delete coordinator
      const { data, error } = await supabase.functions.invoke('delete-coordinator', {
        body: {
          user_id: id,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      const message = getErrorMessage(error);
      toast.error(message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-white">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage team coordinator access credentials.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Coordinator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Coordinator</DialogTitle>
              <DialogDescription>
                Create login credentials for a team coordinator. They will be able to access their team dashboard.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="coordinator@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Team</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TEAMS.map((team) => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="navy">Create User</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Coordinators ({users.length})</CardTitle>
          <CardDescription>List of all active coordinator accounts with team assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No coordinators found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Team</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.team_name}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => deleteUser(user.id, user.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
