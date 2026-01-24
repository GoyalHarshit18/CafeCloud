import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Branch from './Branch.js';

const Floor = sequelize.define('Floor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Branch,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'floors'
});

Branch.hasMany(Floor, { foreignKey: 'branchId', onDelete: 'CASCADE' });
Floor.belongsTo(Branch, { foreignKey: 'branchId' });

export default Floor;
