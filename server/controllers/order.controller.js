import Order from '../models/Order.js';
import Table from '../models/Table.js';

export const createOrder = async (req, res) => {
    try {
        const { tableId, sessionId, items, subtotal, tax, total } = req.body;

        const order = await Order.create({
            table: tableId,
            session: sessionId,
            items,
            subtotal,
            tax,
            total,
            status: 'running'
        });

        await Table.findByIdAndUpdate(tableId, { status: 'occupied' });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderByTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const order = await Order.findOne({ table: tableId, status: 'running' });
        if (!order) {
            return res.status(404).json({ message: 'No running order for this table' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const processPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentMethod } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                status: 'paid',
                paymentMethod,
                paidAt: Date.now()
            },
            { new: true }
        );

        // Update table status back to free
        await Table.findByIdAndUpdate(order.table, { status: 'free' });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
