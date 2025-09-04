import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { selectBasket, selectAllBaskets, selectRequest, selectAllRequests, createBasket, addRequestToBasket } from './services/db_service';
 import { RequestData, BasketData } from './types';


dotenv.config();

const app = express();
const userId = 1;
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Živeli!');
});

app.all('/api/baskets/:basketPath/makeRequest', async (req: Request, res: Response) => { // decided to add the basketPath to the route as the requests coming in only pertain to a particular route.
  try {
    const basketPath = req.params.basketPath;

    if (!basketPath) {
      return res.status(404).json({ error: 'Missing basketPath for the request.' });
    }

    const requestData: RequestData | null = await addRequestToBasket(
      basketPath,
      new Date(),
      req.method,
      JSON.stringify(req.headers),
      JSON.stringify(req.body)
    );

    if (!requestData) {
      return res.status(404).json({ error: 'Request Data failed to be captured' });
    }

    return res.status(200).json({ data: requestData });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return res.status(500).json({ err: err.message });
    }
    return res.status(500).json({ error: 'Unknown error.' });
  }
});

app.get('/api/baskets', async (_req: Request, res: Response) => {
  try {
    const baskets = await selectAllBaskets(userId);

    return res.status(200).json({
      baskets: baskets,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
    return res.status(500).json({ error: 'Unknown error' });
  }
});


app.get('/api/baskets/:basketPath', async (req: Request, res:Response) => {
  try {
    const basketPath = req.params.basketPath;

    const basket = await selectBasket(basketPath);

    if (!basket) {
      return res.status(404).json({error: 'Basket not found'});
    }

    return res.status(200).json({
      basket: basket
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({err: err.message || "Internal Server Error"});
    }
    return res.status(500).json({err: 'Unknown error.'});
  }

});

app.get('/api/baskets/:basketPath/requests', async (req: Request, res: Response) => {
  try {
      const basketPath = req.params.basketPath
      const requests: RequestData[] | null = await selectAllRequests(basketPath);

      res.status(200).json({
        requests: requests
      });
    } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Basket not found' });
    }
  }
});

app.get('/api/baskets/:basketPath/requests/:requestId',  async (req: Request, res: Response) => {
  try {
    const requestId = req.params.requestId;

    if (!requestId) {
      return res.status(400).json({error: "missing requestId"});
    }
      const request:RequestData | null = await selectRequest(requestId);

    if (!request) {
      return res.status(404).json({error: 'Missing Request'});
    }
    return  res.status(200).json({
      request: request
    });
  } catch(err) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({err: err.message || 'Request not found'});
    }
    return res.status(500).json({err: 'Unknown error.'});
  }
});

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