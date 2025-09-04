import { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import type {Basket, Request} from "./types";
import MyBasketsContainer from "./components/MyBasketsContainer.tsx";
import BasketPage from "./components/BasketPage.tsx";


function App() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  // const [isModalOpen, setModalOpen] = useState(false);
  const [currentBasket, setCurrentBasket] = useState<Basket | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

  const baseURL = 'http://localhost:3000';

  useEffect(() => {
    fetchBaskets();
    fetchRequests('1');
    console.log('baskets:', baskets);
  }, []);

  // fetch all the baskets that belong to a user
  const fetchBaskets = async () => {
    try {
      const response = await axios.get<Response>(`${baseURL}/api/baskets`);
      console.log(response)
      const baskets = response.data.baskets;  // this needs to call baskets (b/c the response has tons of stuff
      // in it, the data is what we want but how to Type the get method?
      setBaskets(baskets);
      console.log('baskets:', baskets);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  }

 
  // given a basket id (an integer formatted as a string) fetch all the requests belonging to a basket
  const fetchRequests = async (basketID: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/baskets/${basketID}/requests`
      );
      const requestsData = response.data.requests
      setRequests(requestsData);
      console.log(`requests for basket ${basketID}:`, requestsData);
    } catch (e) {
      console.log(e)
    }
  }

  // given a basket id, return a basket
  const fetchBasket = async (basketID: string) => {
    try {
      const response = await axios.get(`/api/baskets/${basketID}`)
      setCurrentBasket(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }

  const fetchRequest = async (basket: Basket, request: Request) => {
    try {
      const response = await axios.get<Request>(`/api/baskets/${basket.id}/requests/${request.id}`)
      setCurrentRequest(response.data);
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  }

  const deleteBasket = async (basket: Basket) => {
    await axios.delete(`/api/baskets/${basket.id}`);
    fetchBaskets();
  }

  const addBasket = async () => {
    try {
      await axios.post(`/api/baskets/create`);
      fetchBaskets();
    } catch (error) {
      console.error("Error creating basket:", error);
    }
  }

  const onBasketClick = (id:string) => {
    // this is where the routing will go to the basket page
    console.log(`you clicked basket id: ${id}`)
  }

  return (
    <Router>
      <div>

      </div>
      <MyBasketsContainer
        baskets={baskets}
        onBasketClick={onBasketClick}
      />
      <Routes>
        <Route path={`baskets/:id`} element={<BasketPage requests={requests}></BasketPage>}></Route>
      </Routes>
    </Router>
  )
}

export default App;
