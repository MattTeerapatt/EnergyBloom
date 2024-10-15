import { DataTypes, Model } from 'sequelize';
import sequelize from '../src/utils/db';

class lights extends Model {
    public id!: number;
    public user_id!: number;
    public lights_name!: number;
    public lights_unit_usage!: number;
    public lights_count!: number;
    created_at?: Date;
    updated_at?: Date;
}

lights.init(
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
    lights_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lights_unit_usage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lights_count: {
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
    tableName: 'lights',
    timestamps: true,
  }
);

export default lights;
