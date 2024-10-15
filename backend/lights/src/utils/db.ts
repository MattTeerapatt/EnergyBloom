import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize("postgresql://lights:password@lights-db:5432/lights_db"!, {
  dialect: 'postgres',
});

export default sequelize;
