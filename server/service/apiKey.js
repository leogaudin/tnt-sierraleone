import Admin from '../models/admins.model.js';
import { handle401Error } from './errorHandlers.js';
import crypto from 'crypto';

export const generateApiKey = () => {
  const apiKeyLength = 32;
  const randomBytes = crypto.randomBytes(apiKeyLength);
  const apiKey = randomBytes.toString('hex');
  return apiKey;
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
