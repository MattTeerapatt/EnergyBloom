import { DataTypes, Model } from 'sequelize';
import sequelize from '../src/utils/db';

class billings extends Model {
    public id!: number;
    public user_id!: number;
    public month!: number;
    public year!: number;
    public usage!: number;
    public price!: number;
    public tax!: number;
    public total!: number;
    created_at?: Date;
    updated_at?: Date;
}

billings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default value to current timestamp
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default value to current timestamp
    },
  },
  {
    sequelize,
    tableName: 'billings',
    timestamps: true,
  }
);

export default billings;
