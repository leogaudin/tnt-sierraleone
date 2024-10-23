import React from 'react';

import Login from './src/views/Login'
import Scanner from './src/views/Scanner';
import AskPermissions from './src/views/AskPermissions';

import { AppProvider } from './src/context';
import { PaperProvider, Text } from 'react-native-paper';
import theme from './src/theme';
import styles from './src/theme/styles';

export default function App() {
	return (
		<AppProvider>
			<PaperProvider theme={theme}>
				<Login />
				<AskPermissions />
				<Scanner />
			</PaperProvider>
		</AppProvider>
	);
}
