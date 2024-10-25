import express from 'express';
import Admin from '../models/admins.model.js';
import Box from '../models/boxes.model.js';
import {
	createOne,
	createMany,
	deleteOne,
	getById,
	getAll,
	deleteMany,
} from '../service/crud.js';
import { requireApiKey } from '../service/apiKey.js';
import { isFinalDestination } from '../service/index.js';
import { getInsights } from './insights.ctrl.js';

const router = express.Router();

router.post('/box', createOne(Box));
router.post('/boxes', createMany(Box));
router.delete('/box/:id', deleteOne(Box));
router.delete('/boxes', deleteMany(Box))
router.get('/box/:id', getById(Box));
router.get('/boxes', getAll(Box));
router.get('/boxes/:adminId', async (req, res) => {
	try {
		const found = await Admin.findOne({ id: req.params.adminId });
		if (!found)
			return res.status(404).json({ success: false, error: `Admin not found` });

		requireApiKey(req, res, async (admin) => {
			if (admin.id !== req.params.adminId)
				return res.status(401).json({ success: false, error: `Unauthorized` });

			// if (req.query.insights) {
			// 	const boxes = await Box.find({ adminId: req.params.adminId });

			// 	if (!boxes.length)
			// 		return res.status(404).json({ success: false, error: `No boxes available` });

			// 	return res.status(200).json({
			// 		success: true,
			// 		data: {
			// 			boxes: boxes.slice(parseInt(req.query.skip), parseInt(req.query.skip) + parseInt(req.query.limit)),
			// 			insights: getInsights(boxes),
			// 		}
			// 	});
			// }

			const boxes = await Box.find({ adminId: req.params.adminId }).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit));

			if (!boxes.length)
				return res.status(404).json({ success: false, error: `No boxes available` });

			return res.status(200).json({ success: true, data: { boxes } });
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ success: false, error: error });
	}
});

router.post('/boxes/coords', async (req, res) => {
	try {
		const { boxes } = req.body;

		requireApiKey(req, res, async (admin) => {
			let updatedCount = 0;
			let matchedCount = 0;
			let recalculatedCount = 0;

			const boxUpdate = boxes.map((box) => {
				return {
					updateMany: {
						filter: { school: box.school, district: box.district, adminId: admin.id },
						update: { $set: { schoolLatitude: box.schoolLatitude, schoolLongitude: box.schoolLongitude } },
						multi: true,
					},
				};
			});

			const boxUpdateResult = await Box.bulkWrite(boxUpdate);
			updatedCount += boxUpdateResult.modifiedCount;
			matchedCount += boxUpdateResult.matchedCount;

			const boxesToUpdate = await Box.find({
				adminId: admin.id,
				$or: boxes.map((box) => ({ school: box.school, district: box.district }))
			});

			const scansUpdate = boxesToUpdate.map((box) => {
				const scans = box.scans || [];
				scans.forEach((scan) => {
					const schoolCoords = {
						latitude: box.schoolLatitude,
						longitude: box.schoolLongitude,
					};
					const scanCoords = {
						latitude: scan.location.coords.latitude,
						longitude: scan.location.coords.longitude,
					};
					scan.finalDestination = isFinalDestination(schoolCoords, scanCoords);
				});
				return {
					updateOne: {
						filter: { id: box.id },
						update: { $set: { scans: box.scans } },
					},
				};
			});

			const scansUpdateResult = await Box.bulkWrite(scansUpdate);
			recalculatedCount += scansUpdateResult.modifiedCount;

			return res.status(200).json({ success: true, updatedCount, matchedCount, recalculatedCount });
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ success: false, error: error });
	}
});

export default router;
