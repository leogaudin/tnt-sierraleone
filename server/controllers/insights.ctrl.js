import express from 'express';
import Admin from '../models/admins.model.js';
import Box from '../models/boxes.model.js';
import { requireApiKey } from '../service/apiKey.js';
import { handle200Success } from '../service/errorHandlers.js';
import { sampleToRepartition, sampleToTimeline } from '../service/stats.js';

const router = express.Router();

router.post('/toggle_insights', async (req, res) => {
	try {
		const apiKey = req.headers['x-authorization'];

		if (!apiKey)
			return res.status(401).json({ message: 'Unauthorized' });

		const admin = await Admin.findOne({ apiKey });

		if (!admin)
			return res.status(404).json({ message: 'Admin not found' });

		admin.publicInsights = !!!admin.publicInsights;
		await admin.save();
		return res.status(200).json({ message: 'Successfully set insights to ' + admin.publicInsights, publicInsights: admin.publicInsights });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

router.get('/is_public/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const admin = await Admin.findOne({ id });
		if (!admin)
			return res.status(404).json({ message: 'Admin not found' });

		return res.status(200).json({ publicInsights: admin.publicInsights });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

export const getInsights = (boxes) => {
	const insights = {};

	const samples = boxes.reduce((acc, box) => {
		if (!acc[box.project])
			acc[box.project] = [];
		acc[box.project].push(box);
		return acc;
	}, {});

	Object.keys(samples).forEach(project => {
		const sample = samples[project];

		insights[project] = {
			timeline: sampleToTimeline(sample),
			repartition: sampleToRepartition(sample),
		};
	});

	return insights;
};

router.get('/get_insights/:id', async (req, res) => {
	const { id } = req.params;
	const user = await Admin.findOne({ id });

	if (!user)
		return res.status(404).json({ message: 'Admin not found' });

	const boxes = await Box.find({ adminId: id });

	if (!user.publicInsights)
		requireApiKey(req, res, async () => {
			return handle200Success(res, await getInsights(boxes));
		});
	else
		return handle200Success(res, await getInsights(boxes));
});

export default router;
