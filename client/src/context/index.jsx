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
				let hasMore = true;
				const limit = 2100;
				const requests = [];

				while (hasMore) {
					const skip = requests.length * limit;
					const request = await callAPI('GET', `boxes/${user.id}?skip=${skip}&limit=${limit}`);
					requests.push(request);
					const response = await request.json();
					if (response.data.length < limit)
						hasMore = false;
				}

				const responses = await Promise.all(requests);
				const mergedBoxes = responses.reduce((accumulator, response) => {
					return accumulator.concat(response.data);
				}, []);

				mergedBoxes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				setBoxes(mergedBoxes);
				return mergedBoxes;
			} catch (err) {
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
