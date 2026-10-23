import type { ReactNode } from "react";

export const TEST_USER = "user_test";

// Who the current test is signed in as; null when signed out. Reset to signed
// out before every test in setup.ts. Set it before rendering, since the stubs
// below read it at render time.
export const auth = {
	userId: null as string | null,
	signIn(userId = TEST_USER) {
		this.userId = userId;
	},
	signOut() {
		this.userId = null;
	},
};

// Stand-ins for the @clerk/react exports the app uses. Real Clerk needs a
// publishable key and network access.
type ShowProps = { when: "signed-in" | "signed-out"; children: ReactNode };
export const Show = ({ when, children }: ShowProps) =>
	(when === "signed-in") === (auth.userId !== null) ? children : null;

type ChildrenProps = { children: ReactNode };
export const SignInButton = ({ children }: ChildrenProps) => children;
export const SignUpButton = ({ children }: ChildrenProps) => children;
export const UserButton = () => <button type="button">User menu</button>;
export const SignIn = () => <div>Sign in form</div>;
export const SignUp = () => <div>Sign up form</div>;

// The session token is just the user id; the MSW handlers read it back as the
// signed-in user, like the API does with a real Clerk token.
export const getToken = async () => auth.userId;

export const useAuth = () => ({
	isLoaded: true,
	isSignedIn: auth.userId !== null,
	userId: auth.userId,
	getToken,
});
