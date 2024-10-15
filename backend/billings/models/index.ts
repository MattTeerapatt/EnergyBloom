import { Sequelize } from 'sequelize';

// Initialize Sequelize instance
const sequelize = new Sequelize('billings_db'!, 'billings'!, 'password'!, {
  host: 'billings-db',
  dialect: 'postgres',
});

export default sequelize;
