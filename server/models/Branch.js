import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Branch = sequelize.define('Branch', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT
    },
    phone: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'branches'
});

export default Branch;
