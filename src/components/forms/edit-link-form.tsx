import { editUrlSchema, type editUrlSchemaType } from "@/schema/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useAuthContext } from "@/context/auth-context"
import { useEditUrl } from "@/hooks/useEditUrl"
import { useEffect } from "react"

const APP_URL = import.meta.env.VITE_APP_URL;

export const EditLinkForm = ({ url, setOpen }) => {
    const { user } = useAuthContext();
    const { mutate: editUrl, isPending } = useEditUrl();

    const form = useForm<editUrlSchemaType>({
        resolver: zodResolver(editUrlSchema),
        defaultValues: {
            title: "",
            original_url: "",
            custom_url: ""
        }
    });

    useEffect(() => {
        if (!url) return;
        // Only reset if form is untouched
        if (!form.formState.isDirty) {
            form.reset({
                title: url.title ?? "",
                original_url: url.original_url ?? "",
                custom_url: url.custom_url ?? ""
            });
        }
    }, [url?.id]);

    const onSubmit = async (data: editUrlSchemaType) => {
        try {
            if (!user?.id) {
                toast.error("You must be logged in to create a link");
                return;
            }

            const normalizedCustomUrl = data.custom_url?.trim() ? data.custom_url?.trim() : null;

            editUrl({
                title: data.title,
                original_url: data.original_url,
                custom_url: normalizedCustomUrl,
                id: url.id,
                user_id: user.id
            }, {
                onSuccess: () => {
                    setOpen(false);
                }
            })

        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
            console.error("Error in editing url:", message);
            toast.error(message);
        }
    }

    const previewSlug = form.watch("custom_url") || url.short_url;

    return (
        <div className="mt-4">
            <div className="mb-4 text-sm text-muted-foreground text-center">
                {APP_URL}{previewSlug}
            </div>
            <form id="form-rhf-editurl" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    className="font-semibold"
                                    htmlFor="form-rhf-editurl-title">
                                    Short URL Title
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-editurl-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="My short url title"
                                    autoComplete="off"
                                    className="py-4.5"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={(e) => {
                                        field.onChange(e.target.value.trim());
                                        field.onBlur();
                                    }}
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
                                    htmlFor="form-rhf-editurl-original-url">
                                    Original URL
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-editurl-original-url"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="https://www.google.com"
                                    type="url"
                                    autoComplete="off"
                                    className="py-4.5"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={(e) => {
                                        field.onChange(e.target.value.trim());
                                        field.onBlur();
                                    }}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <FieldLabel
                        className="font-semibold -mb-3.5"
                        htmlFor="form-rhf-editurl-custom_url">
                        Custom Url (optional)
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                        <Card className="p-2 rounded-sm line-clamp-1 text-ellipsis">
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
                                        id="form-rhf-editurl-custom_url"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="custom url"
                                        autoComplete="off"
                                        className="py-4.5"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={(e) => {
                                            field.onChange(e.target.value.trim());
                                            field.onBlur();
                                        }}
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
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}
