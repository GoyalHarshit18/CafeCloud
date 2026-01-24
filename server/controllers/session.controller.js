import Session from '../models/Session.js';
import Order from '../models/Order.js';

export const startSession = async (req, res) => {
    try {
        const { userId, branchId, openingBalance } = req.body;
        const session = await Session.create({
            userId,
            branchId,
            openingBalance,
            status: 'open'
        });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const closeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { closingBalance } = req.body;

        const session = await Session.findByPk(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.closingBalance = closingBalance;
        session.endTime = new Date();
        session.status = 'closed';
        await session.save();

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSessionSummary = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const orders = await Order.findAll({
            where: { sessionId, status: 'paid' }
        });

        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const ordersCount = orders.length;

        res.status(200).json({ totalSales, ordersCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
