import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

export interface IconProps {
  size?: number;
  color?: string;
}

const stroke = {
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

export function PlusIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 5v14M5 12h14" stroke={color} {...stroke} />
    </Svg>
  );
}

export function HeartIcon({ size = 24, color = colors.ink, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 20.5C7.2 16.7 3.5 13.4 3.5 9.6 3.5 6.9 5.6 4.8 8.3 4.8c1.5 0 2.9.8 3.7 2 .8-1.2 2.2-2 3.7-2 2.7 0 4.8 2.1 4.8 4.8 0 3.8-3.7 7.1-8.5 10.9z"
        stroke={color}
        {...stroke}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function StarIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3.2z"
        stroke={color}
        {...stroke}
        fill={color}
      />
    </Svg>
  );
}

export function NoteIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9.5 17.5V6.2l10-1.9v11.2" stroke={color} {...stroke} />
      <Circle cx="7" cy="17.5" r="2.6" fill={color} />
      <Circle cx="17" cy="15.5" r="2.6" fill={color} />
    </Svg>
  );
}

export function ShareIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 14V3.5M7.5 7.5L12 3l4.5 4.5M5 12.5V20h14v-7.5" stroke={color} {...stroke} />
    </Svg>
  );
}

export function TrashIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 7h16M9.5 7V4h5v3M6.5 7l1 13h9l1-13" stroke={color} {...stroke} />
    </Svg>
  );
}

export function PlayIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8.5 5.2v13.6c0 .8.9 1.3 1.6.9l10-6.8c.6-.4.6-1.3 0-1.7l-10-6.8c-.7-.5-1.6 0-1.6.8z" fill={color} />
    </Svg>
  );
}

export function PauseIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 5.5v13M16 5.5v13" stroke={color} {...stroke} strokeWidth={2.8} />
    </Svg>
  );
}

export function VolumeIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 9.5v5h3.5l4.5 4V5.5l-4.5 4H4z" stroke={color} {...stroke} fill={color} />
      <Path d="M15.5 9c1.6 1.7 1.6 4.3 0 6M18.2 6.5c3 3.1 3 7.9 0 11" stroke={color} {...stroke} />
    </Svg>
  );
}

export function MuteIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 9.5v5h3.5l4.5 4V5.5l-4.5 4H4z" stroke={color} {...stroke} fill={color} />
      <Path d="M15.5 9.5l5 5M20.5 9.5l-5 5" stroke={color} {...stroke} />
    </Svg>
  );
}

export function BackIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 5l-7 7 7 7" stroke={color} {...stroke} />
    </Svg>
  );
}

export function PhotoIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4.5 5.5h15v13h-15z" stroke={color} {...stroke} />
      <Path d="M6.5 15.5l3.5-3.5 2.7 2.7 2.3-2.2 2.5 3" stroke={color} {...stroke} />
      <Circle cx="9.3" cy="9.3" r="1.5" fill={color} />
    </Svg>
  );
}

export function DownloadIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3.5V14M7.5 10L12 14.5 16.5 10M5 19.5h14" stroke={color} {...stroke} />
    </Svg>
  );
}

export function SparkleIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" stroke={color} {...stroke} fill={color} />
      <Path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" fill={color} />
    </Svg>
  );
}
