import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './theme/index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme/index.js'
import './language/'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</StrictMode>,
)
