import curry from 'lodash.curry';
import * as base16 from 'base16';
import rgb2hex from 'pure-color/convert/rgb2hex';
import parse from 'pure-color/parse';
import flow from 'lodash.flow';
var rgb = require('color-space/rgb');
var yuv = require('color-space/yuv');

const truthy = x => x;
const DEFAULT_BASE16 = base16.default;

const BASE16_KEYS = Object.keys(DEFAULT_BASE16);

// we need a correcting factor, so that a dark, but not black background color
// converts to bright enough inversed color
const flip = x => x < 0.25 ? 1 : (x < 0.5 ? (0.9 - x) : 1.1 - x);

const invertColor = flow(
  parse,
  rgb.yuv,
  ([y, u, v]) => [flip(y), u, v],
  yuv.rgb,
  rgb2hex
);

const invertThemeColors = theme =>
  Object.keys(theme).reduce((t, key) =>
    /^base/.test(key) ?
    (t[key] = invertColor(theme[key]), t) : t, {});

const getStylingByKeys = (customStyling, defaultStyling, keys, ...args) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  const styles = keys
    .reduce((s, key) => [...s, defaultStyling[key], customStyling[key]], [])
    .filter(truthy);

  return styles.reduce((obj, s) => {
    if (typeof s === 'string') {
      return { ...obj, className: [obj.className, s].filter(c => c).join(' ') };
    } else if (typeof s === 'object') {
      return { ...obj, style: { ...obj.style, ...s } };
    } else if (typeof s === 'function') {
      return { ...obj, ...s(obj, ...args) };
    } else {
      return obj;
    }
  }, { className: '', style: {} });
}

export const createStyling = curry(
  (getStylingFromBase16, options, themeOrStyling={}, invertTheme, ...args) => {
    const {
      defaultBase16=DEFAULT_BASE16,
      base16Themes=null
    } = options;

    const base16Theme = getBase16Theme(themeOrStyling, base16Themes);
    if (base16Theme) {
      themeOrStyling = {
        ...base16Theme,
        ...themeOrStyling
      };
    }

    const theme = BASE16_KEYS.reduce((t, key) =>
      (t[key] = themeOrStyling[key] || defaultBase16[key], t), {});

    const customStyling = Object.keys(themeOrStyling).reduce((s, key) =>
      (BASE16_KEYS.indexOf(key) === -1) ?
        (s[key] = themeOrStyling[key], s) : s, {});

    const defaultStyling = getStylingFromBase16(invertTheme ? invertThemeColors(theme) : theme);

    return curry(getStylingByKeys, 3)(customStyling, defaultStyling, ...args);
  }, 4
);

export const getBase16Theme = (theme, base16Themes) => {
  if (theme && theme.extend) {
    theme = theme.extend;
  }

  if (typeof theme === 'string') {
    theme = (base16Themes || {})[theme] || base16[theme];
  }

  return theme && theme.hasOwnProperty('base00') ? theme : undefined;
}
