const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Box = new Schema(
	{
		id: { type: String, required: true },
		project: { type: String, required: true },
		state: { type: String, required: true },
		lgea: { type: String, required: true },
		school: { type: String, required: false },
		schoolCode: { type: String, required: false },
		htName: { type: String, required: false },
		htPhone: { type: String, required: false },
		ssoName: { type: String, required: false },
		ssoPhone: { type: String, required: false },
		schoolLatitude: { type: Number, required: true},
		schoolLongitude: { type: Number, required: true},
		adminId: { type: String, required: true },
		createdAt: { type: Date, required: true },
		scans: { type: Array, required: false },
	}
)

module.exports = mongoose.model('boxes', Box);
