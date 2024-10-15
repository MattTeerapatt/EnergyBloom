import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // You can remove this if you won't use cookies anymore
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Import the User model
import sequelize from './utils/db';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = 3007;
const JWT_SECRET = 'secret';
const PEPPER = 'pepper';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}

sequelize.sync({ force: false }) // Set force: true if you want to drop existing tables
  .then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Users service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error syncing the database:", err);
  });

// Middleware to handle JSON bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Update this to your frontend URL
  credentials: true, // Set to false as we won't use cookies
}));

// Test route to check database connection
app.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();    
    res.json(users);
  } catch (err: any) {
    console.error("Error in query:", err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// New POST route for sign-up
app.post('/sign-up', async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, address1, city, postal_code, date_of_birth } = req.body;
  try {
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      address1,
      city,
      postal_code,
      date_of_birth,
    });
    res.status(201).json(user);
  } catch (err) {
    console.error("Error in sign-up:", err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/sign-in', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Sign-in request received:", email);
  try {
    const user = await User.findOne({where: { email }});
    console.log("Submitting sign-in with:", { email, password });
    console.log("User found:", user);
    // if (user && await bcrypt.compare(password, user.password)) {
    //   console.log("User signed in:", user.email);
    //   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    //   res.status(200).json({ user, token });
    // } 
    if (user && password === user.password) {
      console.log("User signed in:", user.email);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ user, token });
    }
    else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("Error in sign-in:", err);
    res.status(500).json({ error: 'Error signing in' });
  }
});


app.get('/get-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token not provided or invalid' });
    } else {

      const token = authHeader.split(' ')[1];

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ error: 'Invalid or expired token' });
      }

      const userId = (decodedToken as any).userId; // Ensure this is correctly set in the token payload
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
      }

      const user = await User.findByPk(userId);
      console.log("User found--->:", user);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  } catch (error) {
    console.error("Error in /get-login route:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Logout route (no need for this if you're not using cookies, but you can implement a token revocation strategy)
app.post('/sign-out', async (req: Request, res: Response) => {
  console.log("Sign-out request received");
  res.status(200).json({ message: 'Logged out' });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Start the server
// app.listen(PORT, () => {
//   console.log(`User service running on port ${PORT}`);
// });
