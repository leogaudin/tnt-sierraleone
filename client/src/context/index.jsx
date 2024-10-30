import React, { createContext, useEffect, useState } from 'react';
import { callAPI, fetchAllBoxes, fetchInsights, user } from '../service';

const AppContext = createContext({
	boxes: [],
	insights: [],
	language: 'en',
	setLanguage: () => {},
	loading: true,
});

export const AppProvider = ({ children }) => {
	const [boxes, setBoxes] = useState(null);
	const [language, setLanguage] = useState('en');
	const [loading, setLoading] = useState(true);
	const [insights, setInsights] = useState(null);

	useEffect(() => {
		if (!user?.id) return;

		fetchAllBoxes(user.id, setBoxes)
			.then(() => {
				fetchInsights(user.id, setInsights)
					.then(() => {
						setLoading(false);
					})
					.catch((error) => {
						console.error(error);
					});
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<AppContext.Provider
			value={{
				boxes,
				insights,
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
