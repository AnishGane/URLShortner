import { useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/forms/login-form";
import SignUpForm from "@/components/forms/signup-form";

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    return (
        <div className='w-full my-32 flex flex-col justify-center items-center'>
            <h1 className="text-xl sm:text-3xl font-medium">
                {searchParams.get("createNew") ? "Hold on! Let's Login first." : " Login/Signup"}
            </h1>

            <div className=" p-4 max-w-lg mx-auto w-full">
                <Tabs defaultValue="login">
                    <TabsList className={"mx-auto"}>
                        <TabsTrigger value="login" className={"px-12 cursor-pointer"}>Login</TabsTrigger>
                        <TabsTrigger value="signup" className={"px-12 cursor-pointer"}>Sign up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignUpForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AuthPage