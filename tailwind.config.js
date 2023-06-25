/** @type {import('tailwindcss').Config} */
const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'info', 'border', 'frontground', 'background'].reduce((prev, color) => {
  return {
    ...prev,
    [color]: {
      1: `hsl(var(--r-${color}-1))`,
      2: `hsl(var(--r-${color}-2))`,
      3: `hsl(var(--r-${color}-3))`,
    },
  }
}, {})

export const content = [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  'node_modules/roku-ui/dist/roku-ui.js',
]
export const theme = {
  extend: {
    colors: {
      ...colors,
    },
  },
}
export const plugins = [
  require('@tailwindcss/typography'),
]
