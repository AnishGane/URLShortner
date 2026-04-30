import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/db/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const { error } =
                await supabase.auth.exchangeCodeForSession(window.location.href);

            if (error) {
                console.error(error);
                navigate("/auth");
                return;
            }

            navigate("/dashboard");
        };

        handleAuth();
    }, []);

    return <div className="w-full h-screen flex items-center justify-center">
        Signing you in...
    </div>;
}

export default AuthCallback;