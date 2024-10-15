import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize("postgresql://billings:password@billings-db:5432/billings_db"!, {
  dialect: 'postgres',
});

export default sequelize;
