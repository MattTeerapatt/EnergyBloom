import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Billings from './../models/Billings';
import sequelize from './utils/db';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';
import billings from './../models/Billings';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = 3002;
const JWT_SECRET = 'secret';
const TAX = 0.7;

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
      console.log(`Billings usage service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error syncing the database:", err);
  });

// Routes

// Get all usages (for admin or testing)
app.get('/', async (req: Request, res: Response) => {
  try {
    const usages = await Billings.findAll();
    res.json(usages);
  } catch (err: any) {
    console.error("Error in query:", err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// get all biliings
app.get('/billings', async (req: Request, res: Response) => {
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
    const billings = await Billings.findAll({ where: { user_id } });
    if (!billings) {
      res.status(404).json({ message: 'No billings found' });
      return;
    }
    res.json(billings);
  } catch (err: any) {
    console.error("Error fetching billings:", err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Add billing
app.post('/add-billing', async (req: Request, res: Response) => {
  try {
    const { month, year } = req.body;
    const createdAt = dayjs().toISOString();

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
      return;
    }

    const user_id = (decodedToken as any).userId;
    const usageServiceUrl = `http://electricity-usages:3003/get-monthly-usage`;

    try {
      console.log("month:", month, "year:", year);
      const usageResponse = await axios.get(usageServiceUrl, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          month, year
        }
      });
    
      console.log("Response from service:", usageResponse.data);

      if (!usageResponse.data) {
        res.status(404).json({ message: 'No usage data found for this user and month/year' });
        return;
      }

      const { usage, price } = usageResponse.data;
      const tax = Number(price) * TAX;
      const total = Number(price) + Number(tax);

      const createdAt = new Date();

      const newBilling = await Billings.create({
        user_id,
        month,
        year,
        usage,
        price,
        tax,
        total,
        created_at: createdAt,
        updated_at: createdAt,
      });
      console.log("New billing record:", newBilling);

      res.json({ message: 'Billing record created', billing: newBilling });
    } catch (err: any) {
      console.error("Error creating billing record:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    return;
  }
});


app.put('/update-billing/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token not provided or invalid' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const billing = await Billings.findByPk(id);
      if (!billing) {
        res.status(404).json({ error: 'Billing not found' });
        return;
      }
      const month = billing.month;
      const year = billing.year;

      const usageServiceUrl = `http://electricity-usages:3003/get-monthly-usage`;

      try {
        const usageResponse = await axios.get(usageServiceUrl, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            month, year
          }
        });
      
        console.log("Response from service:", usageResponse.data);

        if (!usageResponse.data) {
          res.status(404).json({ message: 'No usage data found for this user and month/year' });
          return;
        }

        const { usage, price } = usageResponse.data;
        const tax = Number(price) * TAX;
        const total = Number(price) + Number(tax);

        console.log("Usage:", usage, "Price:", price, "Tax:", tax, "Total:", total);

        const updatedBilling = await Billings.update({
          user_id: billing.user_id,
          month, 
          year,
          usage,
          price,
          tax,
          total,
          updated_at: dayjs().toISOString()
        }, {
          where: { id }
        });
        
        if (!updatedBilling[0]) {
          res.status(404).json({ error: 'Billing not found' });
          return;
        }

        res.json({ message: 'Billing updated successfully' });
      } catch (error: any) {
        console.error("Error fetching billing:", error.message);
        res.status(500).json({ error: error.message || 'Server error' });
        return;
      }
    } catch (error: any) {
      console.error("Error updating billing:", error.message);
      res.status(500).json({ error: error.message || 'Server error' });
    }
  } catch (error: any) {
    console.error("Error updating billing:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});
