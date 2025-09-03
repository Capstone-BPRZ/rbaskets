import { useState, useEffect } from 'react'
import axios from "axios"
import type {Basket, Request} from "./types";


function App() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentBasket, setCurrentBasket] = useState<Basket | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetchBaskets();
  }, []);

  const fetchBaskets = async () => {
    try {
      const response = await axios.get<Basket>("/api/baskets");
      setBaskets(response.data);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  };

  const fetchBasket = async (basket) => {
    try {
      const response = await axios.get(`/api/baskets/${basket.id}`)
      setCurrentBasket(response.data);
    } catch (error) {
      console.error("Error fetching basket:", error);
    }
  }

  const deleteBasket = (basket) => {
    axios.delete(`/api/todos/${basket.id}`);
    fetchBaskets();
  }

  const addBasket = async (basket) => {
    try {
      await axios.post(`/api/baskets`, basket);
      fetchBaskets();
    } catch (error) {
      console.error("Error creating basket:", error);
    }
  }


  return ()
}

export default App;
