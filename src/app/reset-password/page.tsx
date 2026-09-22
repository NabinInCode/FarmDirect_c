import AuthLayout from "@/app/components/auth/AuthLayout";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import Link from "next/link";
import { JSX } from "react";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}): Promise<JSX.Element> {
    const params = await searchParams;
    const token = params.token ?? "";

    return (
        <AuthLayout
            badge="Account recovery"
            title="Choose a new password."
            subtitle="Pick something strong — you'll use it for every visit to FarmDirect."
            quote="FarmDirect's 100% freshness guarantee means every delivery tastes like it was picked minutes ago."
            quoteAuthor="— FarmDirect promise"
        >
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Reset your password
                </h1>
                <p className="mt-2 text-sm text-muted-2">Enter a new password below.</p>

                {token ? (
                    <ResetPasswordForm token={token} />
                ) : (
                    <div className="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-100">
                        No reset token found. This link may be broken or expired.
                        <Link href="/forgot-password" className="mt-1 block font-semibold text-primary-bright underline">
                            Request a new reset link →
                        </Link>
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-muted">
                    Remembered it?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary-bright transition hover:text-primary hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}