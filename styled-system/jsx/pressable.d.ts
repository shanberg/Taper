/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { PressableProperties } from '../patterns/pressable';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface PressableProps extends PressableProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof PressableProperties > {}

/**
 * Styles for a pressable element


 */
export declare const Pressable: FunctionComponent<PressableProps>