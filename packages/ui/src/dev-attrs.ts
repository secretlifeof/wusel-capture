/**
 * Emits variant data attributes in development mode so the browser extension
 * can capture which variant/size/etc. is active on each component.
 *
 * Attributes use the `data-fsync-` prefix to avoid collisions with Radix UI
 * or other libraries that use `data-state`, `data-side`, etc.
 *
 * In production builds these attributes are stripped (returns empty object).
 */
export function devVariantAttrs(
  variants: Record<string, string | undefined>,
): Record<string, string> {
  if (process.env.NODE_ENV === 'production') return {};
  const attrs: Record<string, string> = {};
  for (const [key, value] of Object.entries(variants)) {
    if (value !== undefined) {
      const attrKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      attrs[`data-fsync-${attrKey}`] = value;
    }
  }
  return attrs;
}
