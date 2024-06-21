/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { SystemProperties } from '../types/style-props';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface InputFieldProperties {
   fontSize?: ConditionalValue<string>
	fontFamily?: ConditionalValue<string>
	backgroundColor?: ConditionalValue<string>
	borderRadius?: ConditionalValue<string>
	border?: ConditionalValue<string>
	padding?: ConditionalValue<string>
	height?: ConditionalValue<string>
	width?: ConditionalValue<string>
	color?: ConditionalValue<string>
	outline?: ConditionalValue<string>
	boxShadow?: ConditionalValue<string>
}


interface InputFieldStyles extends InputFieldProperties, DistributiveOmit<SystemStyleObject, keyof InputFieldProperties > {}

interface InputFieldPatternFn {
  (styles?: InputFieldStyles): string
  raw: (styles?: InputFieldStyles) => SystemStyleObject
}

/**
 * Styles for input fields


 */
export declare const inputField: InputFieldPatternFn;
