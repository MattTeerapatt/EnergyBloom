import { DataTypes, Model } from 'sequelize';
import sequelize from '../src/utils/db';

class aircons extends Model {
    public id!: number;
    public user_id!: number;
    public aircons_name!: number;
    public aircons_unit_usage!: number;
    public aircons_count!: number;
    created_at?: Date;
    updated_at?: Date;
}

aircons.init(
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
    aircons_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aircons_unit_usage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    aircons_count: {
      type: DataTypes.INTEGER,
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
    tableName: 'aircons',
    timestamps: true,
  }
);

export default aircons;
