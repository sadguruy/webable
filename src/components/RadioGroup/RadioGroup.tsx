import { useId, type ChangeEvent, type FieldsetHTMLAttributes } from "react";

import "../TextStyle/styles.css";
import "./styles.css";

export interface RadioGroupOption {
	value: string;
	label: string;
	description?: string;
}

export type RadioGroupVariant = "compact" | "comfortable";

export interface RadioGroupProps extends Omit<
	FieldsetHTMLAttributes<HTMLFieldSetElement>,
	"onChange"
> {
	title?: string;
	smallDescription?: string;
	longDescription?: string;
	variant?: RadioGroupVariant;
	options: RadioGroupOption[];
	selectedValue?: string;
	invalid?: boolean;
	invalidText?: string;
	required?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	onChange?: (value: string) => void;
}

function ErrorIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			aria-hidden="true"
		>
			<circle cx="10" cy="10" r="7" />
			<path d="M10 6.2v4.6" strokeLinecap="round" />
			<path d="M10 13.6h.01" strokeLinecap="round" />
		</svg>
	);
}

export function RadioGroup({
	title,
	smallDescription,
	longDescription,
	variant = "comfortable",
	options,
	selectedValue,
	invalid = false,
	invalidText,
	required = false,
	disabled = false,
	fullWidth = true,
	className = "",
	onChange,
	...props
}: RadioGroupProps) {
	const generatedId = useId();
	const groupId = `radiogroup-${generatedId}`;
	const titleId = title ? `${groupId}-title` : undefined;
	const helperId = smallDescription ? `${groupId}-helper` : undefined;
	const longDescId = longDescription ? `${groupId}-longdesc` : undefined;
	const errorId = invalid && invalidText ? `${groupId}-error` : undefined;
	const describedBy =
		[helperId, longDescId, errorId].filter(Boolean).join(" ") || undefined;

	const classes = [
		"radio-group",
		`radio-group--${variant}`,
		fullWidth ? "radio-group--full" : "",
		invalid ? "radio-group--invalid" : "",
		disabled ? "radio-group--disabled" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!disabled) {
			onChange?.(event.target.value);
		}
	};

	return (
		<fieldset
			className={classes}
			aria-invalid={invalid || undefined}
			aria-describedby={describedBy}
			disabled={disabled}
			{...props}
		>
			{title ? (
				<div className="radio-group__header">
					<legend
						id={titleId}
						className="radio-group__title text-style text-style--label"
					>
						{title}
						{required ? (
							<span className="radio-group__required" aria-hidden="true">
								{" "}
								*
							</span>
						) : null}
					</legend>

					{smallDescription ? (
						<div
							id={helperId}
							className="radio-group__helper text-style text-style--fineprint"
						>
							{smallDescription}
						</div>
					) : null}
				</div>
			) : null}

			{longDescription ? (
				<div
					id={longDescId}
					className="radio-group__long-desc text-style text-style--base"
				>
					{longDescription}
				</div>
			) : null}

			{invalid && invalidText ? (
				<div
					id={errorId}
					className="radio-group__error text-style text-style--fineprint"
					role="alert"
				>
					<span className="radio-group__error-icon">
						<ErrorIcon />
					</span>
					{invalidText}
				</div>
			) : null}

			<div
				className="radio-group__options"
				role="radiogroup"
				aria-labelledby={titleId}
			>
				{options.map((option) => {
					const optionId = `${groupId}-opt-${option.value}`;
					const isChecked = selectedValue === option.value;

					return (
						<label
							key={option.value}
							htmlFor={optionId}
							className="radio-group__option"
							aria-disabled={disabled || undefined}
						>
							<input
								id={optionId}
								className="radio-group__input"
								type="radio"
								name={groupId}
								value={option.value}
								checked={isChecked}
								required={required}
								disabled={disabled}
								onChange={handleChange}
							/>
							<span className="radio-group__control" aria-hidden="true" />
							<span className="radio-group__option-body">
								<span className="radio-group__option-label text-style text-style--base">
									{option.label}
								</span>
								{option.description ? (
									<span className="radio-group__option-desc text-style text-style--fineprint">
										{option.description}
									</span>
								) : null}
							</span>
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}

export default RadioGroup;
