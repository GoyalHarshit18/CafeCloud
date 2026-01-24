import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Branch from './Branch.js';

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Branch,
            key: 'id'
        }
    },
    startTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    endTime: {
        type: DataTypes.DATE
    },
    openingBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    closingBalance: {
        type: DataTypes.DECIMAL(10, 2)
    },
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open'
    }
}, {
    timestamps: true,
    tableName: 'sessions'
});

User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

Branch.hasMany(Session, { foreignKey: 'branchId' });
Session.belongsTo(Branch, { foreignKey: 'branchId' });

export default Session;
