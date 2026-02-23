import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import tpcLogo from "@/assets/tpc-logo.jpeg";

const PortalSelection = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <img src={tpcLogo} alt="TPC Logo" className="w-24 h-24 rounded-full shadow-lg border-2 border-primary/20 mx-auto mb-6" />
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900">TPC Management Portal</h1>
                <p className="text-muted-foreground mt-2">Select your portal to continue</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <Link to="/admin-login">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card className="cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all shadow-md">
                            <CardHeader className="text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Admin Portal</CardTitle>
                                <CardDescription>Full management access for administrators</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </Link>

                <Link to="/coordinator-login">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card className="cursor-pointer border-2 border-transparent hover:border-gold/20 transition-all shadow-md">
                            <CardHeader className="text-center">
                                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-gold" />
                                </div>
                                <CardTitle>Coordinator Portal</CardTitle>
                                <CardDescription>Dedicated dashboard for team coordinators</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
};

export default PortalSelection;
