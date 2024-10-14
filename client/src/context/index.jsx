import React, { createContext, useEffect, useState } from 'react';
import { callAPI, user } from '../service';
import { useToast } from '@chakra-ui/react';

const AppContext = createContext({
	boxes: [],
	language: 'en',
	setLanguage: () => {},
	loading: true,
});

export const AppProvider = ({ children }) => {
	const [boxes, setBoxes] = useState(null);
	const [language, setLanguage] = useState('en');
	const [loading, setLoading] = useState(true);

	const toast = useToast();

	const fetchBoxes = async () => {
		if (user) {
			try {
				setBoxes(null);
				const limit = 2100;
				const responses = [];

				while (true) {
					const skip = responses.length;
					const request = await callAPI('GET', `boxes/${user.id}?skip=${skip}&limit=${limit}`);
					const response = await request.json();
					if (response?.data?.length)
						responses.push(...response?.data);
					if ((response?.data?.length || 0) < limit)
						break;
				}

				responses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				setBoxes(responses);
				return responses;
			} catch (err) {
				console.error(err);
				toast({
					title: 'Error',
					description: err.response?.data?.message || err.message,
					status: 'error',
					duration: 9000,
					isClosable: true,
					position: 'top',
				});
				if (err.response && err.response.status >= 400) {
					setBoxes(null);
				}
			}
		}
	}

	useEffect(() => {
		fetchBoxes()
			.then(() => setLoading(false))
	}, []);

	return (
		<AppContext.Provider
			value={{
				boxes,
				language,
				setLanguage,
				loading,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContext;
