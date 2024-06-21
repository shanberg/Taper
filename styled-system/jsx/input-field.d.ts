/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { InputFieldProperties } from '../patterns/input-field';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface InputFieldProps extends InputFieldProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof InputFieldProperties > {}

/**
 * Styles for input fields


 */
export declare const InputField: FunctionComponent<InputFieldProps>