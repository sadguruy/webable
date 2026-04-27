import {
  useId,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
} from "react";

import "../TextStyle/styles.css";
import "./styles.css";

export interface CheckboxOption {
	value: string;
	label: string;
	description?: string;
}

export type CheckboxVariant = "compact" | "comfortable";

/**
 * Standalone checkbox (single).
 * This is useful when you just want one checkbox with label/description,
 * error, etc. without a group of options.
 */
export interface SingleCheckboxProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "onChange"
> {
	label: string;
	description?: string;
	checked?: boolean;
	invalid?: boolean;
	invalidText?: string;
	variant?: CheckboxVariant;
	fullWidth?: boolean;
	onChange?: (checked: boolean) => void;
}

export interface CheckboxGroupProps extends Omit<
	FieldsetHTMLAttributes<HTMLFieldSetElement>,
	"onChange"
> {
	title?: string;
	smallDescription?: string;
	longDescription?: string;
	variant?: CheckboxVariant;
	options: CheckboxOption[];
	selectedValues?: string[]; // multi-select
	invalid?: boolean;
	invalidText?: string;
	required?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	onChange?: (values: string[]) => void;
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

/**
 * Standalone checkbox component.
 */
export function Checkbox({
	id: idProp,
	label,
	description,
	checked,
	invalid = false,
	invalidText,
	variant = "comfortable",
	fullWidth = false,
	disabled = false,
	className = "",
	onChange,
	...props
}: SingleCheckboxProps) {
	const generatedId = useId();
	const checkboxId = idProp ?? `checkbox-${generatedId}`;
	const errorId = invalid && invalidText ? `${checkboxId}-error` : undefined;
	const descId = description ? `${checkboxId}-desc` : undefined;
	const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

	const classes = [
		"checkbox",
		`checkbox--${variant}`,
		fullWidth ? "checkbox--full" : "",
		invalid ? "checkbox--invalid" : "",
		disabled ? "checkbox--disabled" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!disabled) {
			onChange?.(event.target.checked);
		}
	};

	return (
		<div className={classes}>
			<label className="checkbox__label-wrapper" htmlFor={checkboxId}>
				<input
					id={checkboxId}
					className="checkbox__input"
					type="checkbox"
					checked={checked}
					disabled={disabled}
					aria-invalid={invalid || undefined}
					aria-describedby={describedBy}
					onChange={handleChange}
					{...props}
				/>
				<span className="checkbox__control" aria-hidden="true" />
				<span className="checkbox__body">
					<span className="checkbox__text text-style text-style--base">
						{label}
					</span>
					{description ? (
						<span
							id={descId}
							className="checkbox__description text-style text-style--fineprint"
						>
							{description}
						</span>
					) : null}
				</span>
			</label>

			{invalid && invalidText ? (
				<div
					id={errorId}
					className="checkbox__error text-style text-style--fineprint"
					role="alert"
				>
					<span className="checkbox__error-icon">
						<ErrorIcon />
					</span>
					{invalidText}
				</div>
			) : null}
		</div>
	);
}

/**
 * Checkbox group (multi-select).
 */
export function CheckboxGroup({
	title,
	smallDescription,
	longDescription,
	variant = "comfortable",
	options,
	selectedValues = [],
	invalid = false,
	invalidText,
	required = false,
	disabled = false,
	fullWidth = true,
	className = "",
	onChange,
	...props
}: CheckboxGroupProps) {
	const generatedId = useId();
	const groupId = `checkboxgroup-${generatedId}`;
	const titleId = title ? `${groupId}-title` : undefined;
	const helperId = smallDescription ? `${groupId}-helper` : undefined;
	const longDescId = longDescription ? `${groupId}-longdesc` : undefined;
	const errorId = invalid && invalidText ? `${groupId}-error` : undefined;
	const describedBy =
		[helperId, longDescId, errorId].filter(Boolean).join(" ") || undefined;

	const classes = [
		"checkbox-group",
		`checkbox-group--${variant}`,
		fullWidth ? "checkbox-group--full" : "",
		invalid ? "checkbox-group--invalid" : "",
		disabled ? "checkbox-group--disabled" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;

		const { value, checked } = event.target;
		const set = new Set(selectedValues);

		if (checked) {
			set.add(value);
		} else {
			set.delete(value);
		}

		const nextValues = Array.from(set);
		onChange?.(nextValues);
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
				<div className="checkbox-group__header">
					<legend
						id={titleId}
						className="checkbox-group__title text-style text-style--label"
					>
						{title}
						{required ? (
							<span className="checkbox-group__required" aria-hidden="true">
								{" "}
								*
							</span>
						) : null}
					</legend>

					{smallDescription ? (
						<div
							id={helperId}
							className="checkbox-group__helper text-style text-style--fineprint"
						>
							{smallDescription}
						</div>
					) : null}
				</div>
			) : null}

			{longDescription ? (
				<div
					id={longDescId}
					className="checkbox-group__long-desc text-style text-style--base"
				>
					{longDescription}
				</div>
			) : null}

			{invalid && invalidText ? (
				<div
					id={errorId}
					className="checkbox-group__error text-style text-style--fineprint"
					role="alert"
				>
					<span className="checkbox-group__error-icon">
						<ErrorIcon />
					</span>
					{invalidText}
				</div>
			) : null}

			<div
				className="checkbox-group__options"
				role="group"
				aria-labelledby={titleId}
			>
				{options.map((option) => {
					const optionId = `${groupId}-opt-${option.value}`;
					const isChecked = selectedValues.includes(option.value);

					return (
						<label
							key={option.value}
							htmlFor={optionId}
							className="checkbox-group__option"
							aria-disabled={disabled || undefined}
						>
							<input
								id={optionId}
								className="checkbox-group__input"
								type="checkbox"
								name={groupId}
								value={option.value}
								checked={isChecked}
								required={
									required && options.length === 1
								} /* single required */
								disabled={disabled}
								onChange={handleChange}
							/>
							<span className="checkbox-group__control" aria-hidden="true" />
							<span className="checkbox-group__option-body">
								<span className="checkbox-group__option-label text-style text-style--base">
									{option.label}
								</span>
								{option.description ? (
									<span className="checkbox-group__option-desc text-style text-style--fineprint">
										{option.description}
									</span>
								) : null}
							</span>
						</label>
					);
				})}
			</div>

			{/* {invalid && invalidText ? (
				<div
					id={errorId}
					className="checkbox-group__error text-style text-style--fineprint"
					role="alert"
				>
					<span className="checkbox-group__error-icon">
						<ErrorIcon />
					</span>
					{invalidText}
				</div>
			) : null} */}
		</fieldset>
	);
}

export default CheckboxGroup;
