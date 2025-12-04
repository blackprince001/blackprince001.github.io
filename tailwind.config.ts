import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				serif: ["var(--font-sans)", "TeX Gyre Pagella", "Pagella", "ET Book", "Source Serif Pro", "Source Serif 4", "Apple Garamond", "Baskerville", "Libre Baskerville", "Garamond", "Georgia", "Palatino", "Book Antiqua", "serif", "Noto Emoji", "Quivira"],
				sans: ["var(--font-sans)", "TeX Gyre Pagella", "Pagella", "ET Book", "Source Serif Pro", "Source Serif 4", "Apple Garamond", "Baskerville", "Libre Baskerville", "Garamond", "Georgia", "Palatino", "Book Antiqua", "serif", "Noto Emoji", "Quivira"],
				mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
