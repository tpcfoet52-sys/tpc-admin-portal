import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-primary/20">
                        <FileQuestion className="w-12 h-12 text-primary" />
                    </div>

                    <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        The page you are looking for might have been moved, deleted, or does not exist.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link to="/admin">
                            <Button className="w-full gap-2" variant="default" size="lg">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
