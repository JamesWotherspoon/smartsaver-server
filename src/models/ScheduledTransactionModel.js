const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./UserModel');
const Category = require('./CategoryModel');
const MoneyPot = require('./MoneyPotModel');

const ScheduledTransaction = sequelize.define('ScheduledTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id',
    },
  },
  transactionType: {
    type: DataTypes.ENUM('positive', 'negative'),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  recurrenceType: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually'),
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: true,
  },
  dateOfMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 31,
    },
  },
  monthOfYear: {
    type: DataTypes.ENUM(
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ),
    allowNull: true,
  },
  nextTransactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  moneyPotId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MoneyPot,
      key: 'id',
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

ScheduledTransaction.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

ScheduledTransaction.belongsTo(Category, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',
});

ScheduledTransaction.belongsTo(MoneyPot, {
  foreignKey: 'moneyPotId',
  onDelete: 'SET NULL', // If the money pot is deleted, set the reference to NULL
});

module.exports = ScheduledTransaction;
