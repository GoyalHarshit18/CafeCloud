import Session from '../models/Session.js';

export const openSession = async (req, res) => {
    try {
        const { branchId, openingBalance } = req.body;

        const existingSession = await Session.findOne({
            user: req.user._id,
            branch: branchId,
            status: 'open'
        });

        if (existingSession) {
            return res.status(400).json({ message: 'A session is already open for this branch' });
        }

        const session = await Session.create({
            user: req.user._id,
            branch: branchId,
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
        const { sessionId, closingBalance } = req.body;
        const session = await Session.findByIdAndUpdate(
            sessionId,
            {
                status: 'closed',
                closingBalance,
                endTime: Date.now()
            },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActiveSession = async (req, res) => {
    try {
        const session = await Session.findOne({
            user: req.user._id,
            status: 'open'
        }).populate('branch');

        if (!session) {
            return res.status(404).json({ message: 'No active session found' });
        }

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
