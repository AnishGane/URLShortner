import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/db/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const { error } = await supabase.auth.getSession();

            if (error) {
                console.error(error.message);
                navigate("/auth", { replace: true });
                return;
            }

            const createNew = localStorage.getItem("createNew");
            localStorage.removeItem("createNew");

            navigate(
                createNew
                    ? `/dashboard?createNew=${createNew}`
                    : "/dashboard",
                { replace: true }
            );
        };

        handleAuth();
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center">
            Logging you in...
        </div>
    );
};

export default AuthCallback;