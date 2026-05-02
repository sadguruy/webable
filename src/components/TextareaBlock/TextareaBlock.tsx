import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type TextareaHTMLAttributes,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";

import "../TextStyle/styles.css";
import "./styles.css";

export type TextareaBlockMode = "plain" | "rich";

export interface TextareaBlockProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "onBlur"> {
  mode?: TextareaBlockMode;
  label?: string;
  helperText?: string;
  invalid?: boolean;
  invalidText?: string;
  required?: boolean;
  fullWidth?: boolean;
  minHeight?: number;
  richValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (event?: FocusEvent<HTMLTextAreaElement> | FocusEvent<HTMLDivElement>) => void;
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.2v4.6" strokeLinecap="round" />
      <path d="M10 13.6h.01" strokeLinecap="round" />
    </svg>
  );
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: string;
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`textarea-block__tool ${active ? "is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
    >
      {children}
    </button>
  );
}

export function TextareaBlock({
  id,
  mode = "plain",
  label,
  helperText,
  invalid = false,
  invalidText,
  required = false,
  disabled = false,
  fullWidth = true,
  className = "",
  minHeight = 140,
  richValue,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  ...props
}: TextareaBlockProps) {
  const generatedId = useId();
  const fieldId = id ?? `textarea-block-${generatedId}`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const invalidId = invalid && invalidText ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, invalidId].filter(Boolean).join(" ") || undefined;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder ?? "Write here...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: richValue ?? "",
    editorProps: {
      attributes: {
        class: "textarea-block__rich-editor",
        "aria-invalid": invalid ? "true" : "false",
        "aria-describedby": describedBy ?? "",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
    onBlur: ({ event }) => {
      onBlur?.(event as unknown as FocusEvent<HTMLDivElement>);
    },
  });

  useEffect(() => {
    if (!editor || mode !== "rich") {
      return;
    }

    const nextValue = richValue ?? "";
    if (nextValue !== editor.getHTML()) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, mode, richValue]);

  const handleSetLink = () => {
    if (!editor || disabled) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href ?? "";
    const inputUrl = window.prompt("Enter a link URL", previousUrl);

    if (inputUrl === null) {
      return;
    }

    const trimmedUrl = inputUrl.trim();

    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
  };

  const handleInsertImage = () => {
    if (!editor || disabled) {
      return;
    }

    const imageUrl = window.prompt("Enter an image URL");
    if (!imageUrl) {
      return;
    }

    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
  };

  const richShellStyle: CSSProperties = { minHeight };

  const resizeTextarea = () => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${Math.max(element.scrollHeight, minHeight)}px`;
  };

  useEffect(() => {
    if (mode === "plain") {
      resizeTextarea();
    }
  }, [mode, minHeight, value, defaultValue]);

  const classes = [
    "textarea-block",
    fullWidth ? "textarea-block--full" : "",
    invalid ? "textarea-block--invalid" : "",
    disabled ? "textarea-block--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label ? (
        <div className="textarea-block__header">
          <label className="textarea-block__label text-style text-style--label" htmlFor={fieldId}>
            {label}
            {required ? <span className="textarea-block__required" aria-hidden="true"> *</span> : null}
          </label>

          {helperText ? (
            <div id={helperId} className="textarea-block__helper text-style text-style--fineprint">
              {helperText}
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "plain" ? (
        <textarea
          {...props}
          id={fieldId}
          ref={textareaRef}
          className="textarea-block__input"
          required={required}
          disabled={disabled}
          value={typeof value === "string" ? value : undefined}
          defaultValue={typeof defaultValue === "string" ? defaultValue : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          placeholder={placeholder}
          onChange={(event) => {
            resizeTextarea();
            onChange?.(event.target.value);
          }}
          onBlur={(event) => onBlur?.(event)}
          style={{ minHeight }}
        />
      ) : (
        <div
          className="textarea-block__rich-shell"
          style={richShellStyle}
        >
          <div className="textarea-block__toolbar" role="toolbar" aria-label="Text formatting">
            <ToolbarButton
              label="Bold"
              active={editor?.isActive("bold")}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleBold().run();
              }}
            >
              B
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              active={editor?.isActive("italic")}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleItalic().run();
              }}
            >
              I
            </ToolbarButton>
            <ToolbarButton
              label="Heading 1"
              active={editor?.isActive("heading", { level: 1 })}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleHeading({ level: 1 }).run();
              }}
            >
              H1
            </ToolbarButton>
            <ToolbarButton
              label="Heading 2"
              active={editor?.isActive("heading", { level: 2 })}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleHeading({ level: 2 }).run();
              }}
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              label="Bullet list"
              active={editor?.isActive("bulletList")}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleBulletList().run();
              }}
            >
              UL
            </ToolbarButton>
            <ToolbarButton
              label="Numbered list"
              active={editor?.isActive("orderedList")}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleOrderedList().run();
              }}
            >
              OL
            </ToolbarButton>
            <ToolbarButton
              label="Insert or edit link"
              active={editor?.isActive("link")}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                handleSetLink();
              }}
            >
              Link
            </ToolbarButton>
            <ToolbarButton
              label="Insert image by URL"
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                handleInsertImage();
              }}
            >
              Img
            </ToolbarButton>
            <ToolbarButton
              label="Insert table"
              active={editor?.isActive("table")}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
              }}
            >
              Tbl
            </ToolbarButton>
            <ToolbarButton
              label="Add table row"
              disabled={disabled || !editor?.isActive("table")}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().addRowAfter().run();
              }}
            >
              +Row
            </ToolbarButton>
            <ToolbarButton
              label="Add table column"
              disabled={disabled || !editor?.isActive("table")}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().addColumnAfter().run();
              }}
            >
              +Col
            </ToolbarButton>
            <ToolbarButton
              label="Delete table"
              disabled={disabled || !editor?.isActive("table")}
              onClick={(event) => {
                event.preventDefault();
                editor?.chain().focus().deleteTable().run();
              }}
            >
              Del
            </ToolbarButton>
          </div>

          <div
            id={fieldId}
            className="textarea-block__rich-wrapper"
            aria-describedby={describedBy}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      )}

      {invalid && invalidText ? (
        <div
          id={invalidId}
          className="textarea-block__error text-style text-style--fineprint"
          role="alert"
        >
          <span className="textarea-block__error-icon">
            <ErrorIcon />
          </span>
          {invalidText}
        </div>
      ) : null}
    </div>
  );
}

export default TextareaBlock;
