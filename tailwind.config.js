/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        bone: 'rgb(var(--c-bone) / <alpha-value>)',
        charcoal: 'rgb(var(--c-charcoal) / <alpha-value>)',
        sage: 'rgb(var(--c-sage) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        pine: '#162C22',
        berry: '#8A242C',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'craft-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.85)',
        'craft-card': '0 10px 30px -12px rgba(44, 42, 41, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.85)',
        'craft-hover': '0 22px 44px -16px rgba(44, 42, 41, 0.14), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
      },
    },
  },
  plugins: [],
};
