import { createUrlSchema, type createUrlSchemaType } from "@/schema/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useAuthContext } from "@/context/auth-context"
import { useNavigate } from "react-router-dom";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import QRCode from "react-qrcode-logo";
import { useRef } from "react";

const CreateUrlForm = ({ longLink }: { longLink?: string }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const ref = useRef(null);

    const form = useForm<createUrlSchemaType>({
        resolver: zodResolver(createUrlSchema),
        defaultValues: {
            title: "",
            original_url: longLink ? longLink : "",
            custom_url: ""
        }
    })

    const watchedUrl = form.watch("original_url");

    async function onSubmit(data: createUrlSchemaType) {
        console.log(data);
    }

    return (
        <div className="mt-4">
            <div className="mb-6 flex items-center justify-center">
                {longLink ? <QRCode value={longLink} size={200} ref={ref} /> : watchedUrl ? <QRCode value={watchedUrl} size={200} ref={ref} /> : null}
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
                        <Card className="p-2 rounded-sm pr-11">
                            https://trimm.np
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
                    <Button type="submit" className={"py-5 cursor-pointer mt-4"}>Create</Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default CreateUrlForm