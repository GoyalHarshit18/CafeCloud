import Floor from '../models/Floor.js';
import Table from '../models/Table.js';

export const getFloors = async (req, res) => {
    try {
        const { branchId } = req.query;
        const query = branchId ? { branch: branchId } : {};
        const floors = await Floor.find(query);
        res.status(200).json(floors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTablesByFloor = async (req, res) => {
    try {
        const { floorId } = req.params;
        const tables = await Table.find({ floor: floorId });
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTableStatus = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { status } = req.body;
        const table = await Table.findByIdAndUpdate(tableId, { status }, { new: true });
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
