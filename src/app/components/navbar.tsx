"use client";
import Image from "next/image";
import Link from "next/link";
import { JSX, useState } from "react";
export default function Navbar(): JSX.Element {
	const [open, setOpen] = useState(false);

	return (
		<nav className="w-full bg-[#1B4332] text-white border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-2 ">
						<Link href="/" className="flex items-center rounded-md p-2 hover:bg-[#2C6B4A]">
							<Image src="/logo.jpg" alt="FarmDirect logo" width={80} height={80}  />
						</Link>
					</div>

					<div className="hidden md:flex md:items-center md:space-x-6">
						<Link href="/">Home</Link>
						<Link href="/products">Products</Link>
						<Link href="/about">About</Link>
						<Link href="/contact">Contact</Link>
					</div>

					{/* Actions: Login / Sign up */}
					<div className="hidden md:flex md:items-center md:space-x-3">
                        <Link href="/login" className="bg-white hover:bg-amber-600 text-black  px-3 py-1 rounded-md font-medium">
							Log in
						</Link>
						
						<Link href="/signup" className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md font-medium">
							Sign up
						</Link>
					</div>

					<div className="md:hidden">
						<button
							aria-label="Toggle menu"
							onClick={() => setOpen((v) => !v)}
							className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
						>
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								{open ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{open && (
				<div className="md:hidden px-4 pb-4 space-y-2">
					<Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>
					<Link href="/products" onClick={() => setOpen(false)} className="block">Products</Link>
					<Link href="/about" onClick={() => setOpen(false)} className="block">About</Link>
					<Link href="/contact" onClick={() => setOpen(false)} className="block">Contact</Link>
					<div className="pt-2 border-t border-white/10">
						<Link href="/login" onClick={() => setOpen(false)} className="block py-2">Login</Link>
						<Link href="/signup" onClick={() => setOpen(false)} className="block py-2 font-medium">Sign up</Link>
					</div>
				</div>
			)}
		</nav>
	);
}

