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
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignupForm = () => {
  const { loading, signupUser } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

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
    <Card className="mt-2">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-medium">Sign up here</CardTitle>
        <CardDescription className="text-[12px]">Enter your details to create an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-login-name">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-login-name"
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
                  <Input
                    {...field}
                    id="form-rhf-login-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    autoComplete="off"
                    type="password"
                    className="py-4.5"
                  />
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
                  <FieldLabel htmlFor="form-rhf-login-profile">
                    Choose a profile picture
                  </FieldLabel>
                  <Input className="cursor-pointer" onChange={(e) => field.onChange(e.target.files?.[0])} accept="image/*" id="form-rhf-login-profile" type="file" />
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
      <CardFooter>
        <Button disabled={loading} type="submit" className={"w-full py-5.5 cursor-pointer"} form="form-rhf-login">
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
      </CardFooter>
    </Card>
  )
}

export default SignupForm;