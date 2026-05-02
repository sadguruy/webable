import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { LoginModel } from "./LoginModel";

const meta = {
	title: "Components/LoginModel",
	component: LoginModel,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	args: {
		title: "Welcome Back",
		description: "Please enter your credentials to log in to your account.",
		usernameLabel: "Username",
		usernameHelperText: "Enter your username or email address",
		passwordLabel: "Password",
		passwordHelperText: "Enter your password",
		buttonLabel: "Log In",
		disabled: false,
		onSubmit: fn(),
	},

	render: (args) => (
		<div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
			<LoginModel {...args} />
		</div>
	),
} satisfies Meta<typeof LoginModel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CustomLabels: Story = {
	args: {
		title: "Sign In to Your Account",
		description: "Enter your email and password to continue.",
		usernameLabel: "Email Address",
		usernameHelperText: "We'll send a verification link to this email.",
		passwordLabel: "Password",
		passwordHelperText: "Must be at least 8 characters.",
		buttonLabel: "Sign In",
	},
};

export const Disabled: Story = {
	args: {
		title: "Session Expired",
		description: "Please log in again to continue.",
		usernameLabel: "Username",
		passwordLabel: "Password",
		buttonLabel: "Log In",
		disabled: true,
	},
};

export const Minimal: Story = {
	args: {
		title: "Login",
		description: undefined,
		usernameLabel: "Username",
		usernameHelperText: undefined,
		passwordLabel: "Password",
		passwordHelperText: undefined,
		buttonLabel: "Submit",
	},
};
