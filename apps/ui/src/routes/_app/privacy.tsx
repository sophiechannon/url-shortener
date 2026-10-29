import { Show, useClerk } from "@clerk/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/_app/privacy")({
	component: PrivacyPage,
});

const linkClassName = "underline underline-offset-4";

// Opens Clerk's account settings, where users can view, edit and delete their account.
function AccountSettingsLink() {
	const { openUserProfile } = useClerk();
	return (
		<>
			<Show when="signed-in">
				<button
					type="button"
					className={linkClassName}
					onClick={() => openUserProfile()}
				>
					account settings
				</button>
			</Show>
			<Show when="signed-out">
				<Link to="/authenticate" className={linkClassName}>
					account settings
				</Link>{" "}
				(sign in first)
			</Show>
		</>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-2">
			<h2 className="text-xl font-semibold">{title}</h2>
			{children}
		</section>
	);
}

function PrivacyPage() {
	return (
		<div className="min-h-0 flex-1 overflow-auto">
			<article className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10 text-base/relaxed">
				<header className="flex flex-col gap-1">
					<h1 className="text-3xl font-semibold">Privacy</h1>
					<p className="text-muted-foreground">Last updated 29 October 2026</p>
				</header>

				<p>
					{"//BigUrl"} is a small personal project. This page explains what data
					it keeps, why, and what you can do about it.
				</p>

				<Section title="What is collected">
					<ul className="list-disc pl-6">
						<li>
							<strong>Your account.</strong> If you sign up with a username and
							password, your username and password (stored securely by Clerk,
							never seen by this site). If you sign in with Google, the name,
							email address and profile picture Google shares.
						</li>
						<li>
							<strong>Sign-in details.</strong> Clerk records things like your
							IP address, browser and device to keep your account secure.
						</li>
						<li>
							<strong>Your links.</strong> The URLs you shorten, their short
							versions and when you created them, tied to your account.
						</li>
					</ul>
					<p>
						Anyone with a short link can open it, so don't shorten URLs that
						contain personal or private information.
					</p>
				</Section>

				<Section title="Why">
					<p>
						To let you sign in and to show and manage your links. It's used for
						nothing else: no analytics, no advertising, and nothing is sold or
						shared beyond the services below.
					</p>
				</Section>

				<Section title="Who handles it">
					<ul className="list-disc pl-6">
						<li>Clerk: sign-in and account management.</li>
						<li>Neon: the database that stores your links.</li>
						<li>Amazon Web Services: hosts the API.</li>
					</ul>
					<p>
						Some of these are based in the US, so your data may be processed
						outside the UK.
					</p>
				</Section>

				<Section title="Cookies">
					<p>
						Only the essential cookies Clerk needs to keep you signed in. Your
						light or dark theme choice is saved in your browser. There are no
						tracking or advertising cookies.
					</p>
				</Section>

				<Section title="How long it's kept">
					<p>
						Your account and links are kept until you delete them. Deleting a
						link removes it straight away. Deleting your account also deletes
						all of your links.
					</p>
				</Section>

				<Section title="Your rights">
					<p>
						You can see your links on the home page, and see, change or delete
						your account details in your <AccountSettingsLink />. If you're
						unhappy with how your data is handled, you can complain to the{" "}
						<a
							href="https://ico.org.uk/make-a-complaint/"
							className={linkClassName}
							target="_blank"
							rel="noreferrer"
						>
							Information Commissioner's Office
						</a>
						.
					</p>
				</Section>
			</article>
		</div>
	);
}
