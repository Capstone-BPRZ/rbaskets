import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { selectAllRequests } from './services/db_service';
 import { RequestData } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

 
app.use(express.json());



 app.get('/api/baskets/:basket/requests', async (req: Request, res: Response) => {
      try {
         const basketId = req.params.basket;
         const requests: RequestData[] = await selectAllRequests(basketId);
       
         res.status(200).json({
           requests: requests
         });
       } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          res.status(404).json({ error: error.message || 'Basket not found' });
        }
      }
    });
    
    app.get('/api/baskets/:basket/requests/:request', (req: Request, res: Response) => {
      // Your implementation here
    });



app.post('/api/baskets/create', (req: Request, res: Response) => {


});




app.delete('/api/baskets/basket_id', (req: Request, res: Response) => {


});


app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });