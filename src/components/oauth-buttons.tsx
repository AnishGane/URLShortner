import { useAuthContext } from "@/context/auth-context"
import { Button } from "./ui/button";
import { handleOAuthLogin } from "@/lib/helper";
import { Google } from "@/assets/icons/google";
import { Github } from "@/assets/icons/github";

const OAuthButtons = () => {
    const { loading, oAuthLoading, setOAuthLoading, signInWithGithub, signInWithGoogle } = useAuthContext();
    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center">
            <Button
                disabled={oAuthLoading !== null || loading}
                className={" w-full sm:flex-1 py-6 sm:py-5 gap-2 cursor-pointer"}
                type="button" variant="outline"
                onClick={() => handleOAuthLogin("google", {
                    setOAuthLoading,
                    signInWithGoogle,
                    signInWithGithub,
                })}>
                <Google />
                {oAuthLoading === "google" ? "Redirecting..." : "Continue with Google"}
            </Button>
            <Button
                disabled={oAuthLoading !== null || loading}
                className={"w-full sm:flex-1 py-6 sm:py-5 gap-2 cursor-pointer"}
                type="button" variant="outline"
                onClick={() => handleOAuthLogin("github", {
                    setOAuthLoading,
                    signInWithGoogle,
                    signInWithGithub,
                })}>
                <Github />
                {oAuthLoading === "github" ? "Redirecting..." : "Continue with GitHub"}
            </Button>
        </div>
    )
}

export default OAuthButtons