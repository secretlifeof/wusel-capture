import * as PhosphorIcons from '@phosphor-icons/react/ssr';

import type { IconComponent } from './types';

// Helper function to create wrapped icon component
const createIcon = (PhosphorIcon: any): IconComponent => {
  const Icon: IconComponent = (props) => (
    <PhosphorIcon {...props} size={props.size ?? 48} weight={props.weight || 'bold'} />
  );
  return Icon;
};

// Like createIcon, but for icons that point left/right (chevrons, arrows, panel toggles).
// Adds `rtl:-scale-x-100` so the glyph mirrors automatically under `dir="rtl"`. Pure CSS,
// so it is SSR-safe. Opt out per-instance by passing `className="rtl:scale-x-100"`, which
// overrides the mirror.
const createDirectionalIcon = (PhosphorIcon: any): IconComponent => {
  const Icon: IconComponent = ({ className, ...props }) => (
    <PhosphorIcon
      {...props}
      className={['rtl:-scale-x-100', className].filter(Boolean).join(' ')}
      size={props.size ?? 48}
      weight={props.weight || 'bold'}
    />
  );
  return Icon;
};

// Arrow Icons
export const ArrowRight = createDirectionalIcon(PhosphorIcons.ArrowRightIcon);
export const ArrowUpRight = createIcon(PhosphorIcons.ArrowUpRightIcon);

// Camera & Media Icons
export const Camera = createIcon(PhosphorIcons.CameraIcon);

// Check & Confirm Icons
export const Check = createIcon(PhosphorIcons.CheckIcon);

// Chevron & Navigation Icons
export const ChevronUp = createIcon(PhosphorIcons.CaretUpIcon);
export const ChevronDown = createIcon(PhosphorIcons.CaretDownIcon);

// Copy & Duplicate Icons
export const Copy = createIcon(PhosphorIcons.CopyIcon);

// Download Icons
export const Download = createIcon(PhosphorIcons.DownloadIcon);

// Eye & Visibility Icons
export const EyeOff = createIcon(PhosphorIcons.EyeSlashIcon);

// Heart & Like Icons
export const Heart = createIcon(PhosphorIcons.HeartIcon);

// Help & Info Icons
export const HelpCircle = createIcon(PhosphorIcons.QuestionIcon);

// Edit & Modify Icons
export const Pencil = createIcon(PhosphorIcons.PencilIcon);

// Maximize & Window Icons
export const Maximize2 = createIcon(PhosphorIcons.ArrowsOutIcon);
export const ArrowsOutSimple = createIcon(PhosphorIcons.ArrowsOutSimpleIcon);

// Layout / Monitor Icons
export const MonitorIcon = createIcon(PhosphorIcons.LayoutIcon);

// Loader & Rotate Icons
export const RotateCcw = createIcon(PhosphorIcons.ArrowCounterClockwiseIcon);

// Mail & Message Icons
export const Send = createIcon(PhosphorIcons.PaperPlaneTiltIcon);

// Key & Security Icons
export const ShieldCheck = createIcon(PhosphorIcons.ShieldCheckIcon);

// Square Icons
export const Square = createIcon(PhosphorIcons.SquareIcon);

// Trash & Delete Icons
export const Trash = createIcon(PhosphorIcons.TrashIcon);

// Type & Text Icons
export const Type = createIcon(PhosphorIcons.TextTIcon);

// Close Icons
export const X = createIcon(PhosphorIcons.XIcon);
