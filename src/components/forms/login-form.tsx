import { loginFormSchema, type loginFormSchemaType } from "@/schema/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner"
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { useState } from "react";
import { handleOAuthLogin } from "@/lib/helper";

const LoginForm = () => {
    const { loginUser, loading, oAuthLoading, setOAuthLoading, signInWithGithub, signInWithGoogle } = useAuthContext();
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<loginFormSchemaType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: loginFormSchemaType) {
        try {
            await loginUser(data.email, data.password);
            navigate(longLink ? `/dashboard?createNew=${longLink}` : '/dashboard');
        } catch (error) {
            console.log(error);
            toast.error("Invalid Credentials");
        }
    }

    return (
        <Card className="mt-4">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-medium">Login to your account</CardTitle>
                <CardDescription className="text-[12px]">Enter your email and password.</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-login" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-login-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-login-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="puthere@email.com"
                                        autoComplete="off"
                                        type="email"
                                        className="py-4.5"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-login-password">
                                        Password
                                    </FieldLabel>
                                    <InputGroup className="py-4.5">
                                        <InputGroupInput {...field}
                                            id="form-rhf-login-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="******"
                                            autoComplete="off"
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            {showPassword ? (
                                                <EyeIcon onClick={() => setShowPassword(false)} className="cursor-pointer" />
                                            ) : (
                                                <EyeOffIcon onClick={() => setShowPassword(true)} className="cursor-pointer" />
                                            )}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button disabled={loading || oAuthLoading !== null} type="submit" className={"w-full py-5.5 cursor-pointer"} form="form-rhf-login">
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin size-5 mr-2" />
                            Login...
                        </>
                    ) : (
                        <span>
                            Login
                        </span>
                    )}
                </Button>

                <div className="flex flex-row gap-2 w-full items-center justify-center">
                    <Button
                        disabled={oAuthLoading !== null || loading}
                        className={"flex-1 py-4.5 gap-2 cursor-pointer"}
                        type="button" variant="outline"
                        onClick={() => handleOAuthLogin("google", {
                            setOAuthLoading,
                            signInWithGoogle,
                            signInWithGithub,
                        })}>
                        <img src="https://files.svgcdn.io/material-icon-theme/google.svg" className="size-5" alt="google icon" />
                        {oAuthLoading === "google" ? "Redirecting..." : "Continue with Google"}
                    </Button>
                    <Button
                        disabled={oAuthLoading !== null || loading}
                        className={"flex-1 py-4.5 gap-2 cursor-pointer"}
                        type="button" variant="outline"
                        onClick={() => handleOAuthLogin("github", {
                            setOAuthLoading,
                            signInWithGoogle,
                            signInWithGithub,
                        })}>
                        <img src="https://files.svgcdn.io/zmdi/github.svg" alt="github icon" className="size-5" />
                        {oAuthLoading === "github" ? "Redirecting..." : "Continue with Github"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default LoginForm