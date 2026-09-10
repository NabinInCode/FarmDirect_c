import AuthLayout from "@/app/components/auth/AuthLayout";
import SignupForm from "@/app/components/auth/SignupForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JSX } from "react";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage({
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
            badge="Join the farm family"
            title="Fresh food, honest farms."
            subtitle="Create your account to discover seasonal produce, farm stories, and exclusive offers delivered right to your door."
            quote="Supporting local farmers has never been easier. Every box we order keeps a family farm growing."
            quoteAuthor="— The Delgado household"
        >
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Create your account
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Join FarmDirect to order fresh produce from local farms
                </p>

                <SignupForm redirectTo={redirectTo} />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-[#2D6A4F] transition hover:text-[#1B4332] hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}