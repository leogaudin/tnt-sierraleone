import lzstring from 'lz-string';
import { handle400Error, handle201Success, handle206Success } from '../errorHandlers.js';
import { requireApiKey } from '../apiKey.js';
import { generateId } from '../index.js';

export const createMany = (Model, apiKeyNeeded = true) => async (req, res) => {
	try {
		const { data } = req.body;
		const payload = lzstring.decompressFromEncodedURIComponent(data);
		const instances = JSON.parse(payload);
		// Check API key only once
		let apiKeyChecked = false;
		if (apiKeyNeeded) {
			try {
				await requireApiKey(req, res, async () => {
					apiKeyChecked = true;
				});
			} catch (error) {
				console.error('Error occurred during API key check:', error);
				return handle400Error(res, error);
			}
		}

		if (apiKeyNeeded && !apiKeyChecked)
			return handle400Error(res, 'API key check failed');

		instances.forEach((instance) => {
			instance.createdAt = new Date().getTime();
			instance.id = generateId();
		});

		const inserted = await Model.insertMany(instances);
		return handle201Success(res, 'Items created!', { insertedCount: inserted.length });
	} catch (error) {
		console.error('Error occurred during createMany:', error);
		return handle400Error(res, error);
	}
};
