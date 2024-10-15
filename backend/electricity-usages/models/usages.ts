import { DataTypes, Model } from 'sequelize';
import sequelize from '../src/utils/db';

class usages extends Model {
    public id!: number;
    public user_id!: number;
    public month!: number;
    public year!: number;
    public usage!: number;
    public price!: number;
    created_at?: Date;
    updated_at?: Date;
}

usages.init(
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
    tableName: 'usages',
    timestamps: true,
  }
);

export default usages;
