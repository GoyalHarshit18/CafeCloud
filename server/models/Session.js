import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    openingBalance: { type: Number, default: 0 },
    closingBalance: { type: Number },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
