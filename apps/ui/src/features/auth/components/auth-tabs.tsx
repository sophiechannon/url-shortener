import { SignIn, SignUp } from "@clerk/react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthTabs() {
	return (
		<Card>
			<CardContent>
				<Tabs defaultValue="sign-in">
					<TabsList>
						<TabsTrigger value="sign-in">Sign In</TabsTrigger>
						<TabsTrigger value="sign-up">Sign Up</TabsTrigger>
					</TabsList>
					<TabsContent value="sign-in">
						<SignIn />
					</TabsContent>
					<TabsContent value="sign-up">
						<SignUp />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
