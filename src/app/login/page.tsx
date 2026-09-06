import LoginForm from "@/app/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

export default function LoginPage(): JSX.Element {
    return (
        <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-[calc(42rem+3cm)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:block px-6">
                    <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Welcome back</h2>
                    <p className="text-sm text-gray-700">Log in to manage your orders and explore fresh farm produce delivered to your door.</p>
                    <div className="mt-6">
                        <Image src="/logo.jpg" alt="FarmDirect" width={180} height={180} className="rounded-md" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-semibold mb-2">Log in</h1>
                    <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>
                    <LoginForm />

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don’t have an account? <Link href="/signup" className="text-amber-600 font-medium hover:underline">Sign up</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
