// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = new Pool({
//   host: process.env.PG_HOST,
//   port: Number(process.env.PG_PORT),
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE,
// });

// export const query = (text: string, params?: any[]) => {
//   return pool.query(text, params);
// };


import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
});

export default sequelize;
