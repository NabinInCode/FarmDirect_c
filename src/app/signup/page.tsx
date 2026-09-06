import SignupForm from "@/app/components/auth/SignupForm";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

export default function SignupPage(): JSX.Element {
    return (
        <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-[calc(42rem+3cm)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
                    <p className="text-sm text-gray-500 mb-6">Join FarmDirect to order fresh produce from local farms.</p>
                    <SignupForm />

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account? <Link href="/login" className="text-amber-600 font-medium hover:underline">Log in</Link>
                    </div>
                </div>

                <div className="hidden md:block px-6">
                    <Image src="/logo.jpg" alt="FarmDirect" width={180} height={180} className="rounded-md" />
                    <h2 className="text-2xl font-bold text-[#1B4332] mt-6">Fresh from local farms</h2>
                    <p className="text-sm text-gray-700 mt-2">Sign up to discover seasonal produce, farm stories, and exclusive offers.</p>
                </div>
            </div>
        </main>
    );
}
