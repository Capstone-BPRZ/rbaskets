import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { selectAllRequests, createBasket } from './services/db_service';
 import { RequestData, BasketData } from './types';

dotenv.config();

const app = express();
const userId = 1; 
const PORT = process.env.PORT || 3000;

 

app.use(express.json());




 app.get('/api/baskets/:basket/requests', async (req: Request, res: Response) => {
      try {
         const basketId = req.params.basket;
         const requests: RequestData[] | null = await selectAllRequests(basketId);
       
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
    
    /*
    app.get('/api/baskets/:basket/requests/:request', (req: Request, res: Response) => {
   
    });
*/


app.post('/api/baskets/create', async (_req: Request, res: Response) => {
  try {
    const newBasket: BasketData | null = await createBasket(userId); 

    if (!userId) {
      return res.status(400).json({error: "Missing userId"});
    }

    if (!newBasket) {
      return res.status(404).json({error: 'Basket failed to be Constructed.'});
    }

    const {id, basket_path, user_id} = newBasket; 

    const responseData: BasketData = {id, basket_path, user_id};

    return res.status(200).json(responseData); 
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error creating basker:', err);
       return res.status(500).json({
      err: err.message || 'Internal server error.'
    });
    }
   return res.status(500).json({
    err: 'Unknown error occurred.'
   });
  }

});



/*
app.delete('/api/baskets/basket_id', (req: Request, res: Response) => {


});
*/

app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });