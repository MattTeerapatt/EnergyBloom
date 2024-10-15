import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Usages from './../models/Usages'; // Sequelize model
import sequelize from './utils/db'; // Sequelize instance
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Secure this later with env variables

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust according to frontend origin
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Sync the database (create tables if they don't exist)
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Electricity usage service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error syncing the database:", err);
  });

// Routes

// Get all usages (for admin or testing)
app.get('/', async (req: Request, res: Response) => {
  try {
    const usages = await Usages.findAll();
    res.json(usages);
  } catch (err: any) {
    console.error("Error in query:", err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get monthly usage by user
app.get('/get-monthly-usage', async (req: Request, res: Response) => {
  console.log('Received request for /get-monthly-usage');
  let { month, year } = req.body;
  if (!month || !year) {
    ({ month, year } = req.query);
  }
  console.log('Month:', month, 'Year:', year);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token not provided or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user_id = (decodedToken as any).userId;

  try {
    const usage = await Usages.findOne({
      where: { user_id, month: Number(month), year: Number(year) }
    });

    if (!usage) {
      res.status(404).json({ message: 'No usage found for the given month/year.' });
    } else {
      res.json({ usage: usage.usage, price: usage.price });
    }
  } catch (err: any) {
    console.error("Error fetching monthly usage:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/get-yearly-usage', async (req: Request, res: Response) => {
  const { year } = req.query;
  console.log('Year:', year);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token not provided or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user_id = (decodedToken as any).userId;

  try {
    const usage = await Usages.findAll({
      where: { user_id, year: Number(year) }
    });

    if (!usage) {
      res.status(404).json({ message: 'No usage found for the given year.' });
    } else {
      res.json(usage);
    }
  } catch (err: any) {
    console.error("Error fetching yearly usage:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add new electricity usage
app.post('/add-electricity-usage', async (req: Request, res: Response) => {
  const { month, year, usage } = req.body;
  const createdAt = new Date();
  let price = 0;
  const unit = 4.3;
  price = usage * unit;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token not provided or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user_id = (decodedToken as any).userId;

  try {
    const newUsage = await Usages.create({
      user_id,
      month: month,
      year: year,
      usage,
      price,
      created_at: createdAt,
      updated_at: createdAt
    });

    res.json(newUsage);

  } catch (err: any) {
    console.error("Error adding electricity usage:", err.message);
    res.status(500).json({ error: 'Failed to add electricity usage.' });
  }
});

app.put('/update-electricity-usage', async (req: express.Request, res: express.Response) => {
  const { month, year, usage } = req.body;
  const updatedAt = new Date();
  const unit = 4.3;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token not provided or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: 'Invalid or expired token' });
    return; // Ensure you return after sending a response
  }

  const user_id = (decodedToken as any).userId;

  try {
    // Fetch existing usage
    const existingUsage = await Usages.findOne({
      where: { user_id, month, year }
    });

    if (!existingUsage) {
      res.status(404).json({ message: 'No existing usage found to update.' });
      return;
    }
    const price = Number(usage * unit);

    // Add to the existing usage and price
    const newUsage = Number(existingUsage.usage) + usage;
    const newPrice = Number(existingUsage.price) + price;

    // Update the database with the new values
    await Usages.update(
      { usage: newUsage, price: newPrice, updated_at: updatedAt },
      { where: { user_id, month, year } }
    );

    res.json({ message: 'Usage updated successfully.', newUsage, newPrice });
  } catch (err: any) {
    console.error("Error updating electricity usage:", err.message);
    res.status(500).json({ error: 'Failed to update electricity usage.' });
  }
});

