import AuthLayout from "@/app/components/auth/AuthLayout";
import LoginForm from "@/app/components/auth/LoginForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JSX } from "react";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}): Promise<JSX.Element> {
    const params = await searchParams;
    const redirectTo = params.next?.startsWith("/") ? params.next : "/account";

    const user = await getCurrentUser();
    if (user) redirect("/account");

    return (
        <AuthLayout
            badge="Welcome back"
            title="Locally grown, always fresh."
            subtitle="Log in to manage your orders, track deliveries, and explore seasonal produce picked straight from local farms."
            quote="FarmDirect connects us with farmers in our own community. The produce arrives fresher than anything from a supermarket aisle."
            quoteAuthor="— Sarah M., loyal customer since 2024"
        >
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Log in to your account
                </h1>
                <p className="mt-2 text-sm text-gray-500">Enter your credentials to continue</p>

                <LoginForm redirectTo={redirectTo} />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-[#2D6A4F] transition hover:text-[#1B4332] hover:underline"
                    >
                        Sign up
                    </Link>{" "}
                    and get your first box of farm-fresh goodies.
                </p>
            </div>
        </AuthLayout>
    );
}