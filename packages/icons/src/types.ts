import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';

export type IconProps = Omit<PhosphorIconProps, 'weight'> & {
  weight?: PhosphorIconProps['weight'];
};

export type IconComponent = React.FC<IconProps>;
