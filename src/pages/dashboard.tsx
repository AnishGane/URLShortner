import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/auth-context"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DashboardPage = () => {
    const { logoutUser, loading } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Error logging out");
        }
    }

    return (
        <div>
            <Button disabled={loading} onClick={handleLogout}>
                {loading ? "Logging out..." : "Logout"}
            </Button>
        </div>

    )
}

export default DashboardPage