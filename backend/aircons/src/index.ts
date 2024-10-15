import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Aircons from './../models/Aircons';
import sequelize from './utils/db';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';

dotenv.config();

const app = express();
const PORT = 3001;
const JWT_SECRET = 'secret';
const SALT_ROUNDS = 10; 

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


// Get all usages (for admin or testing)
app.get('/', async (req: Request, res: Response) => {
  try {
    const usages = await Aircons.findAll();
    res.json(usages);
  } catch (err: any) {
    console.error("Error in query:", err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.get('/aircons', async (req: Request, res: Response) => {
  console.log('Received request for /aircons');
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
    const aircons = await Aircons.findAll({ where: { user_id } });
    if (aircons.length === 0) {
      res.status(404).json({ message: 'No aircons found for this user.' });
      return;
    }
    res.json(aircons);
  } catch (error: any) {
    console.error("Error fetching aircons:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

app.get('/get-unit-usage', async (req: Request, res: Response) => {

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
    const aircons = await Aircons.findAll({ where: {user_id}  });
    if (!aircons) {
      res.status(404).json({ message: 'No aircons found' });
      return;
    }

    const totalUsage = aircons.reduce((acc, aircon) => {
      return acc + (aircon.aircons_count * Number(aircon.aircons_unit_usage));
    }, 0);

    res.json({ totalUsage });
  } catch (error: any) {
    console.error("Error fetching aircons:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

app.post('/add-aircon', async (req: Request, res: Response) => {
  console.log('Received request for /add-aircons');
  try {
    const { aircons_name, aircons_count, aircons_unit_usage } = req.body;
    console.log("Adding aircons:", aircons_name, aircons_count, aircons_unit_usage);
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

    const newAircon = await Aircons.create({
      user_id,
      aircons_name,
      aircons_count,
      aircons_unit_usage,
      created_at: createdAt,
      updated_at: createdAt,
    });

    res.status(201).json(newAircon);
  } catch (error: any) {
    console.error("Error adding aircons:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});


// Update aircons
app.put('/update-aircon/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { aircons_name, aircons_unit_usage, aircons_count } = req.body; 
    console.log(
      "Updating aircons:",
      aircons_name,
      aircons_count,
      aircons_unit_usage
    );

    try {
      const aircon = await Aircons.findByPk(id);
      if (!aircon) {
        res.status(404).json({ error: 'Aircon not found' });
        return;
      }

      await Aircons.update(
        {
          aircons_name,  
          aircons_unit_usage,
          aircons_count,
          updated_at: dayjs().toISOString(), 
        },
        {
          where: { id },
        }
      );

      const updatedAircon = await Aircons.findByPk(id); 

      res.json({
        message: 'Aircon updated successfully',
        updatedAircon,  
      });
    } catch (error: any) {
      console.error("Error fetching aircon:", error.message);
      res.status(500).json({ error: error.message || 'Server error' });
    }
  } catch (error: any) {
    console.error("Error updating aircon:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Other routes...

// Delete an aircon
app.delete('/delete-aircon/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check for authorization token
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

    // Find the aircon by ID
    const aircon = await Aircons.findOne({ where: { id, user_id } });
    if (!aircon) {
      res.status(404).json({ error: 'Aircon not found' });
      return;
    }

    // Delete the aircon
    await aircon.destroy();

    res.json({ message: 'Aircon deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting aircon:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});
