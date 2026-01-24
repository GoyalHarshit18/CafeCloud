import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    notes: { type: String }
});

const orderSchema = new mongoose.Schema({
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: ['draft', 'running', 'paid', 'cancelled'],
        default: 'draft'
    },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'other'] },
    paidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
