import React, { createContext, useEffect, useState } from 'react';
import { fetchBoxes, user } from '../service';

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

	useEffect(() => {
		if (!user?.id) return;
		fetchBoxes(user.id, setBoxes)
			.then(() => setLoading(false))
	}, []);

	return (
		<AppContext.Provider
			value={{
				boxes,
				language,
				setLanguage,
				loading,
				fetchBoxes,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContext;
