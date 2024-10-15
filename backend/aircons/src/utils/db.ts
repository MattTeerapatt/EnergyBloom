import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize("postgresql://aircons:password@aircons-db:5432/aircons_db"!, {
  dialect: 'postgres',
});

export default sequelize;
