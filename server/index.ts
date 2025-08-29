import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Dummy POST route for /api/baskets/create
app.post('/api/baskets/create', (req: Request, res: Response) => {
  // Extract data from request body (if needed)
  const { name, description } = req.body;

  // Dummy implementation - just log the request
  console.log('Creating basket with:', { name, description });

  // Send a simple response
  res.status(201).json({
    message: 'Basket created successfully (dummy implementation)',
    basket: {
      id: 'dummy-id-123',
      name: name || 'Default Basket',
      description: description || 'No description provided',
      createdAt: new Date().toISOString()
    }
  });
});

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});