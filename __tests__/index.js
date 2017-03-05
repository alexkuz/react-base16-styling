import test from 'ava';
import { createStyling, invertTheme, getBase16Theme } from '../src';
import apathy from 'base16/lib/apathy';

const base16Theme = {
  scheme: 'myscheme',
  author: 'me',
  base00: '#000000',
  base01: '#222222',
  base02: '#444444',
  base03: '#666666',
  base04: '#999999',
  base05: '#bbbbbb',
  base06: '#dddddd',
  base07: '#ffffff',
  base08: '#ff0000',
  base09: '#ff9900',
  base0A: '#ffff00',
  base0B: '#999900',
  base0C: '#009999',
  base0D: '#009900',
  base0E: '#9999ff',
  base0F: '#ff0099'
};

const invertedBase16Theme = {
  scheme: 'myscheme:inverted',
  author: 'me',
  base00: '#ffffff',
  base01: '#ffffff',
  base02: '#a2a1a2',
  base03: '#807f80',
  base04: '#807f80',
  base05: '#5e5d5e',
  base06: '#3c3b3c',
  base07: '#1a191a',
  base08: '#ff4d4d',
  base09: '#cb6500',
  base0A: '#545400',
  base0B: '#a2a20a',
  base0C: '#0fa8a8',
  base0D: '#32cb32',
  base0E: '#6868ce',
  base0F: '#ff2ac3'
};

const apathyInverted = {
  author: 'jannik siebert (https://github.com/janniks)',
  base00: '#efffff',
  base01: '#e3ffff',
  base02: '#daffff',
  base03: '#67a49a',
  base04: '#66a399',
  base05: '#51857c',
  base06: '#3c635d',
  base07: '#2a3f3c',
  base08: '#2f8779',
  base09: '#4e89a6',
  base0A: '#8391db',
  base0B: '#b167bf',
  base0C: '#c8707e',
  base0D: '#a7994f',
  base0E: '#469038',
  base0F: '#3a9257',
  scheme: 'apathy:inverted'
};

const getStylingFromBase16 = base16 => ({
  testClass: 'testClass',
  testStyle: {
    color: base16.base00
  },
  testFunc: ({ className, style }, arg) => ({
    className: 'test--' + arg,
    style: {
      ...style,
      width: 0,
      color: base16.base00
    }
  })
});

test('invertTheme', t => {
  t.deepEqual(invertTheme(base16Theme), invertedBase16Theme);
});

test('getBase16Theme', t => {
  t.deepEqual(getBase16Theme('apathy'), apathy);
  t.deepEqual(getBase16Theme({ extend: 'apathy' }), apathy);
  t.deepEqual(getBase16Theme('apathy:inverted'), apathyInverted);
  t.is(getBase16Theme({}), undefined);
});

test('createStyling', t => {
  const styling = createStyling(getStylingFromBase16, { defaultBase16: apathy });
  const defaultStyling = styling(undefined);

  t.deepEqual(defaultStyling('testClass'), { className: 'testClass', style: {} });
  t.deepEqual(defaultStyling('testStyle'), { className: '', style: { color: apathy.base00 } });
});
