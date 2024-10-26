import Admin from '../models/admins.model.js';
import { handle401Error } from './errorHandlers.js';
import { generateId } from './index.js';

export const generateApiKey = () => {
  return generateId();
}

export const requireApiKey = async (req, res, next) => {
	if (!req.headers['x-authorization']) {
		return handle401Error(res, 'API key required');
	}

	const apiKey = req.headers['x-authorization'];
	const admin = await Admin.findOne({ apiKey });

	if (!admin) {
		return handle401Error(res, 'Invalid API key');
	}

	return next(admin);
};
