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

const router = express.Router();

router.post('/box', createOne(Box));
router.post('/boxes', createMany(Box));
router.delete('/box/:id', deleteOne(Box));
router.delete('/boxes', deleteMany(Box))
router.get('/box/:id', getById(Box));
router.get('/boxes', getAll(Box));

router.get('/boxes/:adminId', async (req, res) => {
	try {
		const admin = await Admin.findOne({ id: req.params.adminId });
		if (!admin)
			return res.status(404).json({ success: false, error: `Admin not found` });
		if (!admin.publicInsights) {
			const apiKey = req.headers['x-authorization'];
			if (!apiKey)
				return res.status(401).json({ success: false, error: 'API key required' });
			else if (apiKey !== admin.apiKey) {
				return res.status(401).json({ success: false, error: 'Invalid API key' });
			}
		}

		const boxes = await Box.find({ adminId: req.params.adminId }).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit));

		if (!boxes.length)
			return res.status(404).json({ success: false, error: `No boxes available` });

		return res.status(200).json({ success: true, data: boxes });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
});

router.post('/boxes/coords', async (req, res) => {
	try {
		const { boxes } = req.body;
		const apiKey = req.headers['x-authorization'];
		if (!apiKey)
			return res.status(401).json({ success: false, error: 'API key required' });
		const admin = await Admin.findOne({ apiKey });
		let updatedCount = 0;
		let matchedCount = 0;
		await Promise.all(boxes.map(async (box) => {
			const result = await Box.updateMany(
				{ school: box.school, district: box.district, adminId: admin.id },
				{ $set: { schoolLatitude: box.schoolLatitude, schoolLongitude: box.schoolLongitude } },
				{ 'multi': true }
			);
			matchedCount += result.matchedCount;
			updatedCount += result.modifiedCount;
			return;
		}));
		await Promise.all(boxes.map(async (box) => {
			const boxesToUpdate = await Box.find({ school: box.school, district: box.district, adminId: admin.id });

			const bulkWrite = boxesToUpdate.map((box) => {
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
			await Box.bulkWrite(bulkWrite);
		}));
		return res.status(200).json({ success: true, updatedCount, matchedCount });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
});

export default router;
