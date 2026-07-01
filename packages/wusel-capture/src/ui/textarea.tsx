import * as React from 'react';

import { cn } from '../lib/cn';

// Exact class string from the shared UI Textarea so it matches the app.
export const textareaClassName =
	'flex field-sizing-content max-h-64 min-h-16 w-full resize-none appearance-none overflow-y-auto rounded-sm border border-secondary bg-input px-3 py-2 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm';

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return <textarea className={cn(textareaClassName, className)} {...props} />;
}
