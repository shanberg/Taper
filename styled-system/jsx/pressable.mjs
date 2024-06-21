import { createElement, forwardRef } from 'react'

import { splitProps } from '../helpers.mjs';
import { getPressableStyle } from '../patterns/pressable.mjs';
import { styled } from './factory.mjs';

export const Pressable = /* @__PURE__ */ forwardRef(function Pressable(props, ref) {
  const [patternProps, restProps] = splitProps(props, [])

const styleProps = getPressableStyle(patternProps)
const mergedProps = { ref, ...styleProps, ...restProps }

return createElement(styled.div, mergedProps)
  })