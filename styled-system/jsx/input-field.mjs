import { createElement, forwardRef } from 'react'

import { splitProps } from '../helpers.mjs';
import { getInputFieldStyle } from '../patterns/input-field.mjs';
import { styled } from './factory.mjs';

export const InputField = /* @__PURE__ */ forwardRef(function InputField(props, ref) {
  const [patternProps, restProps] = splitProps(props, ["fontSize","fontFamily","backgroundColor","borderRadius","border","padding","height","width","color","outline","boxShadow"])

const styleProps = getInputFieldStyle(patternProps)
const mergedProps = { ref, ...styleProps, ...restProps }

return createElement(styled.div, mergedProps)
  })