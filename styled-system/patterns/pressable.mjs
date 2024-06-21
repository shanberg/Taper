import { getPatternStyles, patternFns } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const pressableConfig = {
transform(props) {
  return {
    ...props
  };
},
defaultValues:{fontFamily:'body',fontSize:'md',backgroundColor:'bgControl',borderRadius:'control',border:'none',padding:'0.25rem 0.5rem',height:'controlHeight',lineHeight:'controlHeight',color:'inherit',outline:'none',position:'relative',cursor:'pointer',_disabled:{cursor:'not-allowed'},_hover:{},_focus:{zIndex:1,boxShadow:'controlFocusVisible'}}}

export const getPressableStyle = (styles = {}) => {
  const _styles = getPatternStyles(pressableConfig, styles)
  return pressableConfig.transform(_styles, patternFns)
}

export const pressable = (styles) => css(getPressableStyle(styles))
pressable.raw = getPressableStyle