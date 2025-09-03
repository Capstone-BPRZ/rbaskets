import { useState, useEffect } from 'react';
import axios from "axios";
import type {Basket, Request} from "./types";


function App() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentBasket, setCurrentBasket] = useState<Basket | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);

  const baseURL = 'http://localhost:3000';


  const fetchBaskets = async () => {
    try {
      const response = await axios.get<Basket[]>(`${baseURL}/api/baskets`);
      setBaskets(response.data);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  }

  useEffect(() => {
    fetchBaskets();
    console.log('baskets:', baskets);
  }, []);


  const fetchBasket = async (basket) => {
    try {
      const response = await axios.get(`/api/baskets/${basket.id}`)
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


  return (
    <>
      Živeli!
    </>
  )
}

export default App;
