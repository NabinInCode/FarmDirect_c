import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

export default function Footer(): JSX.Element {
	return (
		<footer className="bg-[#0f2b1f] text-white border-t">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="space-y-3">
						<Link href="/" className="flex items-center gap-3">
							<Image src="/logo.jpg" alt="FarmDirect logo" width={64} height={64} />
							<span className="text-lg font-semibold">FarmDirect</span>
						</Link>
						<p className="text-sm text-white/80">Fresh produce direct from local farms.</p>
					</div>

					<div className="md:flex md:justify-center">
						<nav aria-label="Footer navigation">
							<ul className="grid grid-cols-2 gap-2 text-sm">
								<li>
									<Link href="/" className="hover:underline">Home</Link>
								</li>
								<li>
									<Link href="/products" className="hover:underline">Products</Link>
								</li>
								<li>
									<Link href="/about" className="hover:underline">About</Link>
								</li>
								<li>
									<Link href="/contact" className="hover:underline">Contact</Link>
								</li>
							</ul>
						</nav>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium">Contact</h3>
						<address className="not-italic text-sm text-white/80">
							<a href="mailto:farmDirect123@.com" className="hover:underline">farmDirect123@.com</a>
							<br />
							<a href="tel:067-545672" className="hover:underline">067-545672</a>
						</address>

						<div className="flex space-x-3 mt-2" aria-hidden>
							<a href="#" aria-label="Twitter" className="hover:text-amber-400">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
									<path d="M8.29 20.251c7.547 0 11.675-6.155 11.675-11.49 0-.175 0-.349-.012-.522A8.18 8.18 0 0 0 22 5.92a8.36 8.36 0 0 1-2.357.637 4.077 4.077 0 0 0 1.804-2.243 8.18 8.18 0 0 1-2.605.988 4.1 4.1 0 0 0-6.993 3.738A11.64 11.64 0 0 1 3.149 4.6a4.032 4.032 0 0 0-.555 2.063 4.1 4.1 0 0 0 1.823 3.413 4.077 4.077 0 0 1-1.857-.509v.05a4.1 4.1 0 0 0 3.292 4.016 4.095 4.095 0 0 1-1.852.07 4.1 4.1 0 0 0 3.827 2.85A8.233 8.233 0 0 1 2 18.407a11.616 11.616 0 0 0 6.29 1.84" />
								</svg>
							</a>

							<a href="#" aria-label="Facebook" className="hover:text-amber-400">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
									<path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.93v-7.03H8.08v-2.9h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.9h-2.1v7.03C18.34 21.19 22 17.06 22 12.07z" />
								</svg>
							</a>

							<a href="#" aria-label="Instagram" className="hover:text-amber-400">
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
									<rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="1.5" />
									<path d="M17.5 6.5h.01" strokeWidth="2" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				<div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/70 flex flex-col md:flex-row md:justify-between items-center">
					<p>© {new Date().getFullYear()} FarmDirect. All rights reserved.</p>
					<p className="mt-3 md:mt-0">Built with care by local farmers.</p>
				</div>
			</div>
		</footer>
	);
}

