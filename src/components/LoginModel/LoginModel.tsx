import { useState, type ChangeEvent, type FormEvent } from "react";

import { ActionButton } from "../ActionButton/index";
import { TextField } from "../TextField/TextField";
import { TextStyle } from "../TextStyle/TextStyle";

import "./styles.css";

export interface LoginModelProps {
	/** Title displayed at the top of the login form */
	title?: string;
	/** Description text displayed below the title */
	description?: string;
	/** Label for the username field */
	usernameLabel?: string;
	/** Helper text for the username field */
	usernameHelperText?: string;
	/** Label for the password field */
	passwordLabel?: string;
	/** Helper text for the password field */
	passwordHelperText?: string;
	/** Label for the submit button */
	buttonLabel?: string;
	/** Callback when form is submitted */
	onSubmit?: (values: { username: string; password: string }) => void;
	/** Disable the input fields */
	disabled?: boolean;
	/** Additional CSS class name */
	className?: string;
}

export function LoginModel({
	title = "Welcome Back",
	description = "Please enter your credentials to log in to your account.",
	usernameLabel = "Username",
	usernameHelperText = "Enter your username or email address",
	passwordLabel = "Password",
	passwordHelperText = "Enter your password",
	buttonLabel = "Log In",
	onSubmit,
	disabled = false,
	className = "",
}: LoginModelProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		onSubmit?.({ username, password });
	};

	const classes = ["login-model", className].filter(Boolean).join(" ");

	return (
		<div className={classes}>
			<div className="login-model__header">
				{title && (
					<TextStyle as="h2" variant="h2" className="login-model__title">
						{title}
					</TextStyle>
				)}
				{description && (
					<TextStyle
						as="p"
						variant="base"
						muted
						className="login-model__description"
					>
						{description}
					</TextStyle>
				)}
			</div>

			<form className="login-model__form" onSubmit={handleSubmit}>
				<TextField
					label={usernameLabel}
					type="text"
					helperText={usernameHelperText}
					value={username}
					onChange={handleUsernameChange}
					disabled={disabled}
					required
					autoComplete="username"
				/>

				<TextField
					label={passwordLabel}
					type="password"
					helperText={passwordHelperText}
					value={password}
					onChange={handlePasswordChange}
					disabled={disabled}
					required
					autoComplete="current-password"
				/>

				<ActionButton
					type="submit"
					variant="primary"
					width="full"
					label={buttonLabel}
					disabled={disabled}
				/>
			</form>
		</div>
	);
}

export default LoginModel;
