import express, { Request, Response } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

 
app.use(express.json());



app.get('api/baskets/:basket/requests', (req: Request, res: Response) => {

});

app.get('api/baskets/:basket/requests/:request', (req: Request, res: Response) => {

});



app.post('/api/baskets/create', (req: Request, res: Response) => {


});




app.delete('/api/baskets/basket_id', (req: Request, res: Response) => {


});


app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });