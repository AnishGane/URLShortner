import { createUrlSchema, type createUrlSchemaType } from "@/schema/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useAuthContext } from "@/context/auth-context"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useCreateUrl } from "@/hooks/useCreateUrl";
import { toast } from "sonner";
import type React from "react";

const APP_URL = import.meta.env.VITE_APP_URL;

const CreateUrlForm = ({ longLink, setOpen }: { longLink?: string, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { user } = useAuthContext();

    const form = useForm<createUrlSchemaType>({
        resolver: zodResolver(createUrlSchema),
        defaultValues: {
            title: "",
            original_url: longLink ? longLink : "",
            custom_url: ""
        }
    })

    const { mutate: createUrl, isPending } = useCreateUrl();

    async function onSubmit(data: createUrlSchemaType) {
        try {
            if (!user?.id) {
                toast.error("You must be logged in to create a link");
                return;
            }

            // urls (table) contains the isUnique constraint so needed to normalize it before creating link to solve the duplicate key error
            const normalizedCustomUrl = data.custom_url?.trim()
                ? data.custom_url?.trim()
                : null;

            createUrl({
                ...data,
                custom_url: normalizedCustomUrl,
                userId: user?.id,
            }, {
                onSuccess: () => {
                    toast.success("Link created successfully");
                    setOpen(false);
                    form.reset();
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to create link");
                }
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
            console.error("Error in creating url:", message);
            toast.error(message);
        }
    }

    const previewSlug = form.watch("custom_url") || "";

    return (
        <div className="mt-4">
            <div className="mb-4 text-sm text-muted-foreground text-center">
                {APP_URL || "http://localhost:5173"}{previewSlug}
            </div>
            <form id="form-rhf-createurl" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="font-semibold"
                                    htmlFor="form-rhf-createurl-title">
                                    Short URL Title
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-createurl-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="My short url title"
                                    autoComplete="off"
                                    className="py-4.5"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="original_url"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="font-semibold"
                                    htmlFor="form-rhf-createurl-original-url">
                                    Original URL
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-createurl-original-url"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="https://www.google.com"
                                    type="url"
                                    autoComplete="off"
                                    className="py-4.5"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <FieldLabel
                        className="font-semibold -mb-3.5"
                        htmlFor="form-rhf-createurl-custom_url">
                        Custom Url (optional)
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                        <Card className="p-2 rounded-sm line-clamp-1 text-ellipsis text-nowrap">
                            {APP_URL || "http://localhost:5173"}
                        </Card>
                        /
                        <Controller
                            name="custom_url"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} >
                                    <Input
                                        {...field}
                                        id="form-rhf-createurl-custom_url"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="custom url"
                                        autoComplete="off"
                                        className="py-4.5"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <Button
                        disabled={isPending}
                        type="submit"
                        className={"py-5 cursor-pointer mt-4"}>
                        {isPending ? "Creating..." : "Create"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default CreateUrlForm