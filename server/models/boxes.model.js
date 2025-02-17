import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// MUST MATCH boxFields VARIABLE IN client/src/service/specific.js
export const boxFields = {
	project: { type: String, required: true },
	province: { type: String, required: true },
	district: { type: String, required: false },
	council: { type: String, required: false },
	chiefdom: { type: String, required: false },
	school: { type: String, required: true },
	htName: { type: String, required: false },
	htPhone: { type: String, required: false },
};

const Box = new Schema(
	{
		id: { type: String, required: true },
		...boxFields,
		adminId: { type: String, required: true },
		createdAt: { type: Date, required: true },
		scans: { type: Array, required: false },
		schoolLatitude: { type: Number, required: true},
		schoolLongitude: { type: Number, required: true},
		statusChanges: { type: Object, required: false },
		progress: { type: String, required: false, default: 'noScans' },
		lastScan: { type: Object, required: false },
	}
)

export default mongoose.model('boxes', Box);
