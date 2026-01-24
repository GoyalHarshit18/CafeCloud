import Floor from '../models/Floor.js';
import Table from '../models/Table.js';
import Product from '../models/Product.js';

export const getFloors = async (req, res) => {
    try {
        const floors = await Floor.findAll({
            include: [{
                model: Table,
                attributes: ['id', 'number', 'seats', 'status']
            }]
        });
        res.status(200).json(floors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTableStatus = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { status } = req.body;

        const table = await Table.findByPk(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        table.status = status;
        await table.save();

        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
