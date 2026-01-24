import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

export default mongoose.model('Floor', floorSchema);
