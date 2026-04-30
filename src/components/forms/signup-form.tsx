import { signUpFormSchema, type signUpFormSchemaType } from "@/schema/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import OAuthButtons from "../oauth-buttons";

const SignupForm = () => {
  const { loading, signupUser, oAuthLoading } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      profile_pic: undefined,
    },
  });

  async function onSubmit(data: signUpFormSchemaType) {
    try {
      await signupUser(data.email, data.password, data.name, data.profile_pic);
      toast.success("Signup successful");

      navigate(longLink ? `/dashboard?createNew=${longLink}` : '/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while signup";
      console.log(message);
      toast.error(message);
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-medium">Sign up here</CardTitle>
        <CardDescription className="text-[12px]">Enter your details to create an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-signup" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-signup-name">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-signup-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                    type="text"
                    className="py-4.5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-signup-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-signup-email"
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
                  <FieldLabel htmlFor="form-rhf-signup-password">
                    Password
                  </FieldLabel>
                  <InputGroup className="py-4.5">
                    <InputGroupInput {...field}
                      id="form-rhf-signup-password"
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
            <Controller
              name="profile_pic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-signup-profile">
                    Choose a profile picture
                  </FieldLabel>
                  <Input className="cursor-pointer" onChange={(e) => field.onChange(e.target.files?.[0])} accept="image/*" id="form-rhf-signup-profile" type="file" />
                  <FieldDescription className="text-[13px]">Select a picture to upload.</FieldDescription>
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
        <Button disabled={loading || oAuthLoading !== null} type="submit" className={"w-full py-5.5 cursor-pointer"} form="form-rhf-signup">
          {loading ? (
            <>
              <Loader2 className="animate-spin size-5 mr-2" />
              Signing...
            </>
          ) : (
            <span>
              Sign up
            </span>
          )}
        </Button>

        <OAuthButtons />
      </CardFooter>
    </Card>
  )
}

export default SignupForm;