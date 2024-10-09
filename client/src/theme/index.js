import {
	extendTheme,
	baseTheme,
} from '@chakra-ui/react'

const primary = {
	light: '#EBF0FE',
	main: '#0949FF',
	dark: '#0033C0',
}

export const palette = {
	colorScheme,
	text: 'black',
	background: white,
	primary: primary,
	success: {
		light: baseTheme.colors.green[100],
		main: baseTheme.colors.green[500],
		dark: baseTheme.colors.green[900],
	},
	warning: {
		light: baseTheme.colors.orange[100],
		main: baseTheme.colors.orange[500],
		dark: baseTheme.colors.orange[900],
	},
	error: {
		light: baseTheme.colors.red[100],
		main: baseTheme.colors.red[500],
		dark: baseTheme.colors.red[900],
	},
	info: {
		light: baseTheme.colors.blue[100],
		main: baseTheme.colors.blue[500],
		dark: baseTheme.colors.blue[900],
	},
}

export const theme = extendTheme({
	initialColorMode: 'light',
	styles: {
		global: {
			"html, body": {
				margin: 0,
				padding: 0,
				boxSizing: "border-box",
				color: palette.text,
				backgroundColor: palette.background,
				zIndex: 0,
			},
			'::selection': {
				backgroundColor: palette.text,
				color: palette.background,
			},
			'h1, h2, h3, h4, h5, h6': {
				marginBottom: 2,
			},
		},
	},
	colors: palette,
	fonts: {
		body: 'DM Sans, sans-serif',
		heading: 'DM Sans, sans-serif',
		mono: 'Menlo, monospace',
	},
	fontWeights: {
		heading: 800,
	},
	fontSizes: {
		heading: '3rem',
		heading2: '2.5rem',
		heading3: '2rem',
	},
	components: {
		Heading: {
			baseStyle: {
				fontWeight: 900,
			},
		},
	},
})
