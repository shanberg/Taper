import { getPatternStyles, patternFns } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const inputFieldConfig = {
transform(props) {
  return {
    ...props
  };
},
defaultValues:{fontFamily:'body',fontSize:'md',backgroundColor:'bgControl',borderRadius:'control',border:'none',width:'100%',padding:'0 0.5rem',height:'controlHeight',maxHeight:'controlHeight',minHeight:'controlHeight',lineHeight:'controlHeight',color:'inherit',outline:'none',position:'relative',_focus:{zIndex:1,boxShadow:'controlFocusVisible'},'&.isWarning':{boxShadow:'controlWarning'}}}

export const getInputFieldStyle = (styles = {}) => {
  const _styles = getPatternStyles(inputFieldConfig, styles)
  return inputFieldConfig.transform(_styles, patternFns)
}

export const inputField = (styles) => css(getInputFieldStyle(styles))
inputField.raw = getInputFieldStyle