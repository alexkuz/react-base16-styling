import curry from 'lodash.curry';
import * as base16 from 'base16';

const truthy = x => x;
const returnEmptyObject = () => ({});
const DEFAULT_BASE16 = base16.default;

const BASE16_KEYS = Object.keys(DEFAULT_BASE16);
const GRAY_COLORS = Array.from({ length: 8 }).map((_, idx) => `base0${idx}`);

const getReversedKey = key =>
  (GRAY_COLORS.indexOf(key) !== -1) ? `base0${7 - key.match(/base0(\d)/)[1]}` : key;

const reverseTheme = theme =>
  Object.keys(theme).reduce((t, key) =>
    (t[getReversedKey(key)] = theme[key], t), {});

const getStylingByKeys = (customStyling, defaultStyling, keys, ...args) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  const styles = keys
    .reduce((s, key) => [...s, defaultStyling[key], customStyling[key]], [])
    .filter(truthy);

  return styles.reduce((obj, s) => {
    if (typeof s === 'string') {
      return { ...obj, className: obj.className + ' ' + s };
    } else if (typeof s === 'object') {
      return { ...obj, style: { ...obj.style, ...s } };
    } else if (typeof s === 'function') {
      return { ...obj, ...s(obj, ...args) };
    } else {
      return obj;
    }
  }, { className: '', style: {} });
}

const createStyling = curry(
  (options, themeOrStyling={}, base16Themes, isLightTheme, ...args) => {
    const {
      getStylingFromBase16=returnEmptyObject,
      defaultBase16=DEFAULT_BASE16
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

    const defaultStyling = getStylingFromBase16(isLightTheme ? reverseTheme(theme) : theme);

    return curry(getStylingByKeys, 3)(customStyling, defaultStyling, ...args);
  }, 4
);

const getBase16Theme = (theme, base16Themes) => {
  if (theme && theme.extend) {
    theme = theme.extend;
  }

  if (typeof theme === 'string') {
    theme = (base16Themes || {})[theme] || base16[theme];
  }

  return theme && theme.hasOwnProperty('base00') ? theme : undefined;
}

export { createStyling, getBase16Theme };
