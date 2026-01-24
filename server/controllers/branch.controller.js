import Branch from '../models/Branch.js';

export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find({ isActive: true });
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBranch = async (req, res) => {
    try {
        const branch = await Branch.create(req.body);
        res.status(201).json(branch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
