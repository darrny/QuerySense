import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // This is the critical line that was missing
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config