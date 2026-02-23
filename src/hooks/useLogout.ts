import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useLogout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        try {
            const isAdmin = location.pathname.startsWith('/admin');

            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            toast.success("Logged out successfully");

            // Redirect to appropriate login page
            if (isAdmin) {
                navigate("/admin-login");
            } else {
                navigate("/coordinator-login");
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Logout error:", error);
            toast.error(error.message || "Failed to log out");
        }
    };

    return { logout };
};
