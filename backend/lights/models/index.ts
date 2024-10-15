import { Sequelize } from 'sequelize';

// Initialize Sequelize instance
const sequelize = new Sequelize('lights_db'!, 'lights'!, 'password'!, {
  host: 'lights-db',
  dialect: 'postgres',
});

export default sequelize;
