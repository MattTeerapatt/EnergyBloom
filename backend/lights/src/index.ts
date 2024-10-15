import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Lights from './../models/Lights';
import sequelize from './utils/db';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';

dotenv.config();

const app = express();
const PORT = 3004;
const JWT_SECRET = 'secret'; // Secure this later with env variables

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
      console.log(`Lights usage service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error syncing the database:", err);
  });

// Routes

// Get all usages (for admin or testing)
app.get('/', async (req: Request, res: Response) => {
  try {
    const usages = await Lights.findAll();
    res.json(usages);
  } catch (err: any) {
    console.error("Error in query:", err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});


app.get('/lights', async (req: Request, res: Response) => {
  console.log('Received request for /lights');
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
    const lights = await Lights.findAll({ where: { user_id } });
    if (lights.length === 0) {
      res.status(404).json({ message: 'No lights found for this user.' });
      return;
    }
    res.json(lights);
  } catch (error: any) {
    console.error("Error fetching lights:", error.message);
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
    const lights = await Lights.findAll({ where: {user_id}  });
    if (!lights) {
      res.status(404).json({ message: 'No lights found' });
      return;
    }

    const totalUsage = lights.reduce((acc, light) => {
      return acc + (light.lights_count * Number(light.lights_unit_usage));
    }, 0);

    res.json({ totalUsage });
  } catch (error: any) {
    console.error("Error fetching lights:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

app.post('/add-light', async (req: Request, res: Response) => {
  try {
    const { lights_name, lights_count, lights_unit_usage } = req.body;
    const createdAt = dayjs().toISOString();
    console.log("Adding lights:", lights_name, lights_count, lights_unit_usage);

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

    const newLights = await Lights.create({
      user_id,
      lights_name,
      lights_unit_usage,
      lights_count,
      created_at: createdAt,
      updated_at: createdAt,
    });

    res.status(201).json(newLights);
  } catch (error: any) {
    console.error("Error adding lights:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Update lights
app.put('/update-light/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lights_name, lights_unit_usage, lights_count } = req.body;
    console.log(
      "Updating lights:",
      lights_name,
      lights_unit_usage,
      lights_count
    );

    try {
      const light = await Lights.findByPk(id);
      if (!light) {
        res.status(404).json({ error: 'Light not found' });
        return;
      }

      await Lights.update(
        {
          lights_name,  
          lights_unit_usage,
          lights_count,
          updated_at: dayjs().toISOString(),  
        },
        {
          where: { id },
        }
      );

      const updatedLight = await Lights.findByPk(id);

      res.json({
        message: 'Light updated successfully',
        updatedLight,  
      });
    } catch (error: any) {
      console.error("Error fetching light:", error.message);
      res.status(500).json({ error: error.message || 'Server error' });
    }
  } catch (error: any) {
    console.error("Error updating light:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});


// Other routes...

// Delete an light
app.delete('/delete-light/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

    const light = await Lights.findOne({ where: { id, user_id } });
    if (!light) {
      res.status(404).json({ error: 'Light not found' });
      return;
    }

    await light.destroy();

    res.json({ message: 'Light deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting light:", error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});