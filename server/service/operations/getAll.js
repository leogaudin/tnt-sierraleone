import { handle400Error, handle200Success, handle404Error } from '../errorHandlers.js';
import { requireApiKey } from '../apiKey.js';

export const getAll = (Model, apiKeyNeeded = true) => async (req, res) => {
	try {
		if (apiKeyNeeded) {
			return requireApiKey(req, res, async () => {
				const instances = await Model.find({});

				if (!instances.length) {
					return handle404Error(res);
				}

				return handle200Success(res, instances);
			});
		}

		const instances = await Model.find({});

		if (!instances.length) {
			return handle404Error(res);
		}

		return handle200Success(res, instances);
	} catch (error) {
		console.log(error);
		return handle400Error(res, error);
	}
};
