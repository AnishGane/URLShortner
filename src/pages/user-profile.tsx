import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"
import { useAuthContext } from "@/context/auth-context"
import type { ProfileSection } from "@/types";
import { Switch } from "@/components/ui/switch"
import DeleteAccountDialog from "@/components/dialogs/delete-account-dialog";
import { formatDate } from "@/lib/helper";

const UserProfile = () => {
    const { user } = useAuthContext();

    const providers: string[] = user?.app_metadata?.providers ?? [];
    const safe = (val?: string) => val || "-";

    const profileSections: ProfileSection[] = [
        {
            label: "Personal Information",
            values: [
                { label: "Full Name", value: safe(user?.user_metadata?.full_name || user?.user_metadata?.name) },
                { label: "Username", value: safe(user?.user_metadata?.user_name) },
                { label: "Account Created At", value: formatDate(user?.created_at) },
                { label: "Last Signed in At", value: formatDate(user?.last_sign_in_at) },
            ]
        },
        {
            label: "Additional Information",
            values: [
                { label: "Role", value: user?.role || "user" },
                { label: "Email", value: safe(user?.email || user?.user_metadata?.email) },
                { label: "Last Updated At", value: formatDate(user?.updated_at) },
            ]
        }
    ]

    const personalInformation = profileSections[0];
    const additionalInformation = profileSections[1];

    const isEmailVerified = !!user?.email_confirmed_at;
    const isPhoneVerified = !!user?.phone_confirmed_at;

    return (
        <div className="px-4 sm:px-0 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-10">

                {/* Personal */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-medium">
                        {personalInformation.label}
                    </h1>

                    <Card className="px-0 sm:px-2 py-5 sm:py-6 mt-3">
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {personalInformation.values.map((item) => (
                                    <div key={item.label}>
                                        <h1 className="text-base sm:text-lg font-medium">
                                            {item.label}
                                        </h1>
                                        <p className="text-xs sm:text-sm">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-medium">
                        {additionalInformation.label}
                    </h1>

                    <Card className="px-0 sm:px-2 py-5 sm:py-6 mt-3">
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {additionalInformation.values.map((item) => (
                                    <div key={item.label}>
                                        <h1 className="text-base sm:text-lg font-medium">
                                            {item.label}
                                        </h1>
                                        <p className="text-xs sm:text-sm">{item.value}</p>
                                    </div>
                                ))}
                                <div>
                                    <h1 className="text-base sm:text-lg font-medium">Providers Used</h1>
                                    {providers.length === 0 && <p className="text-sm">-</p>}
                                    {providers.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {providers.map((provider, index) => (
                                                <Badge key={index}>
                                                    {provider}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Email & Phone Verified fields and Switch */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-medium">
                        Verification Status
                    </h1>
                    <Card className="px-0 sm:px-2 py-5 sm:py-6 mt-3">
                        <CardContent className="flex items-center justify-between">
                            <h1 className="text-sm sm:text-base font-medium">Email Verified</h1>
                            <Switch checked={!!isEmailVerified} disabled />
                        </CardContent>
                    </Card>
                    <Card className="px-0 sm:px-2 py-5 sm:py-6 mt-3">
                        <CardContent className="flex items-center justify-between">
                            <h1 className="text-sm sm:text-base font-medium">Phone Verified</h1>
                            <Switch checked={!!isPhoneVerified} disabled />
                        </CardContent>
                    </Card>
                </div>

                {/* Delete Action */}
                <div className="sm:mt-10">
                    <Card className="px-0 sm:px-2 py-5 sm:py-6">
                        <CardContent>
                            <div>
                                <div className="mb-4">
                                    <h1 className="text-base sm:text-lg font-medium">Delete Account</h1>
                                    <p className="text-muted-foreground">
                                        Deleting your account is permanent and cannot be undone. This will remove all your data, shortened links, and account information from our systems.
                                    </p>
                                </div>
                                <DeleteAccountDialog />
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default UserProfile
