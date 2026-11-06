import type {PrismTheme} from 'prism-react-renderer';

/**
 * Code highlighting painted with the panel's own tokens. Every colour is a CSS
 * variable, so the three themes (light, dim, dark) each get their own palette
 * from custom.css and nothing here is hard-coded.
 */
const theme: PrismTheme = {
  plain: {
    color: 'var(--color-base-content)',
    backgroundColor: 'var(--color-base-200)',
  },
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: 'var(--code-comment)', fontStyle: 'italic'}},
    {types: ['punctuation', 'operator'], style: {color: 'var(--code-punctuation)'}},
    {types: ['keyword', 'selector', 'atrule', 'important', 'builtin'], style: {color: 'var(--color-primary)'}},
    {types: ['string', 'char', 'attr-value', 'inserted', 'template-string'], style: {color: 'var(--color-success)'}},
    {types: ['number', 'boolean', 'constant', 'symbol', 'regex'], style: {color: 'var(--color-info)'}},
    {types: ['function', 'class-name', 'tag', 'maybe-class-name'], style: {color: 'var(--color-info)'}},
    {types: ['property', 'attr-name', 'variable', 'parameter'], style: {color: 'var(--code-property)'}},
    {types: ['deleted'], style: {color: 'var(--color-error)'}},
    {types: ['bold'], style: {fontWeight: '600'}},
    {types: ['italic'], style: {fontStyle: 'italic'}},
  ],
};

export default theme;
