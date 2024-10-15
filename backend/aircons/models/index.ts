
import { Sequelize } from 'sequelize';

// Initialize Sequelize instance
const sequelize = new Sequelize('aircons_db'!, 'aircons'!, 'password'!, {
  host: 'aircons-db',
  dialect: 'postgres',
});

export default sequelize;