import base from '@repo/prettier-config';

/** @type {import("prettier").Config} */
export default {
  ...base,
  plugins: [...(base.plugins ?? []), 'prettier-plugin-tailwindcss'],
};
