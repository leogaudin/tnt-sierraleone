const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Box = new Schema(
	{
		id: { type: String, required: true },
		project: { type: String, required: true },
		academicInspection: { type: String, required: false },
		educationAndTrainingInspection: { type: String, required: false },
		commune: { type: String, required: false },
		school: { type: String, required: true },
		administrativeCode: { type: String, required: false },
		directorName: { type: String, required: false },
		directorPhone: { type: String, required: true },
		schoolLatitude: { type: Number, required: false},
		schoolLongitude: { type: Number, required: false},
		adminId: { type: String, required: true },
		createdAt: { type: Date, required: true },
		scans: { type: Array, required: false },
	}
)

module.exports = mongoose.model('boxes', Box);
