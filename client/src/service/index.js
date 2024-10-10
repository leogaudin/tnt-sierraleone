import i18n from "../language";

import Home from "../pages/Home";
import Login from "../pages/Login"

import { IoHome } from "react-icons/io5";


export const API_URL =
						// process.env.NODE_ENV === 'development'
						// ? 'http://localhost:3000/api'
						// :
						'https://track-and-trace-api.vercel.app/api'

export const user = JSON.parse(localStorage.getItem('user'));

export const navbarWidth = '250px';

export const callAPI = async (method, endpoint, data = null, headers = {}) => {
	const authorization = user?.apiKey || null;
	const requestHeaders = {
		'Content-Type': 'application/json',
		'X-Authorization': authorization,
		...headers,
	};

	const response = await fetch(`${API_URL}/${endpoint}`, {
		method: method,
		headers: requestHeaders,
		body: data ? JSON.stringify(data) : null,
	});

	return response;
}

export const routes = [
	{
		path: '/',
		component: Home,
		title: i18n.t('home'),
		inNav: true,
		icon: IoHome,
	},
	{
		path: '/2',
		component: Home,
		title: i18n.t('home') + 2333333,
		inNav: true,
		icon: IoHome,
	},
	{
		path: '/3',
		component: Home,
		title: i18n.t('home') + 3,
		inNav: true,
		icon: IoHome,
	},
	{
		path: '/auth',
		component: Login,
		public: true,
	},
]
