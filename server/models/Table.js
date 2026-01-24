import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    seats: { type: Number, default: 2 },
    status: {
        type: String,
        enum: ['free', 'occupied', 'pending', 'reserved'],
        default: 'free'
    },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true }
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
