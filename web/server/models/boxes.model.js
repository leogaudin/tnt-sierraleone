const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Box = new Schema(
	{
		id: { type: String, required: true },
		project: { type: String, required: true },
		province: { type: String, required: true },
		district: { type: String, required: false },
		council: { type: String, required: false },
		chiefdom: { type: String, required: false },
		school: { type: String, required: true },
		htName: { type: String, required: false },
		htPhone: { type: String, required: false },
		schoolLatitude: { type: Number, required: true},
		schoolLongitude: { type: Number, required: true},
		adminId: { type: String, required: true },
		createdAt: { type: Date, required: true },
		scans: { type: Array, required: false },
	}
)

module.exports = mongoose.model('boxes', Box);
