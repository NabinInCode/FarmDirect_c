import AuthLayout from "@/app/components/auth/AuthLayout";
import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";
import Link from "next/link";
import { JSX } from "react";

export default function ForgotPasswordPage(): JSX.Element {
    return (
        <AuthLayout
            badge="Account recovery"
            title="Reset your password."
            subtitle="We'll generate a secure link for you to choose a new password and get back to farm-fresh shopping."
            quote="I forgot my password once and the reset took less than a minute. Back to ordering tomatoes the same evening."
            quoteAuthor="— Priya K., FarmDirect customer"
        >
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Forgot your password?
                </h1>
                <p className="mt-2 text-sm text-muted-2">No worries, it happens to the best of us.</p>

                <ForgotPasswordForm />

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