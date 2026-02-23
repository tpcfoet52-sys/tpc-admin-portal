import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredTeam?: string;
}

const ProtectedRoute = ({ children, requiredTeam }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!supabase) {
                    console.error("Supabase client not initialized");
                    navigate("/admin-login");
                    return;
                }
                // Get current session
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    // Not logged in
                    const isScanningAdmin = window.location.pathname.startsWith('/admin');
                    navigate(isScanningAdmin ? "/admin-login" : "/coordinator-login");
                    return;
                }

                const userMetadata = session.user.user_metadata;
                const userTeam = userMetadata?.team;
                const isAdmin = userMetadata?.role === 'admin';

                // 1. If it's an admin route, verify the 'admin' role metadata
                if (window.location.pathname.startsWith('/admin')) {
                    if (!isAdmin) {
                        console.warn("Unauthorized access attempt: Not an Admin");
                        navigate("/admin-login");
                        return;
                    }
                }
                // 2. If it's a specific team route, verify the team matches
                else if (requiredTeam && userTeam !== requiredTeam) {
                    console.warn(`Unauthorized access attempt: Expected ${requiredTeam}, found ${userTeam}`);

                    // Specific dashboard redirects based on team
                    if (userTeam === "Event & Hospitality Team") {
                        navigate("/coordinator/events");
                    } else if (userTeam === "Content & Media Team") {
                        navigate("/coordinator/media");
                    } else if (userTeam) {
                        navigate("/coordinator/dashboard");
                    } else {
                        navigate("/coordinator-login");
                    }
                    return;
                }
                // 3. Fallback: If it's a coordinator route and user has NO team metadata
                else if (!isAdmin && !userTeam && window.location.pathname.startsWith('/coordinator')) {
                    console.error("User logged in but missing team metadata");
                    navigate("/coordinator-login");
                    return;
                }

                // Auth valid
                setIsChecking(false);
            } catch (error) {
                console.error("Auth check failed", error);
                navigate("/coordinator-login");
            }
        };

        checkAuth();

        // Listen for auth changes
        if (!supabase) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                const isScanningAdmin = window.location.pathname.startsWith('/admin');
                navigate(isScanningAdmin ? "/admin-login" : "/coordinator-login");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate, requiredTeam]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
