import { useState, useEffect } from 'react';
import axios from "axios";
import type {Basket, Request} from "./types";
import MyBasketsContainer from "./components/MyBasketsContainer.tsx";


function App() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentBasket, setCurrentBasket] = useState<Basket | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);

  const baseURL = 'http://localhost:3000';

  // fetch all the baskets that belong to a user
  const fetchBaskets = async () => {
    try {
      const response = await axios.get<Basket[]>(`${baseURL}/api/baskets`);
      const baskets = response.data;
      setBaskets(baskets);
      console.log('baskets:', baskets);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  }

  useEffect(() => {
    fetchBaskets();
    fetchRequests('1'); // for testing right now
  }, []);

  // given a basket id (an integer formatted as a string) fetch all the requests belonging to a basket
  const fetchRequests = async (basketID: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/baskets/${basketID}/requests`
      );
      const data = response.data
      setRequests(data.requests);
      console.log(`requests for basket ${basketID}:`, response.data);
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
      console.error("Error fetching basket:", error);
    }
  }

  const deleteBasket = async (basket: Basket) => {
    await axios.delete(`/api/todos/${basket.id}`);
    fetchBaskets();
  }

  const addBasket = async () => {
    try {
      await axios.post(`/api/baskets`);
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
    <>
      <MyBasketsContainer
        baskets={baskets}
        onBasketClick={onBasketClick}
      />
    </>
  )
}

export default App;
