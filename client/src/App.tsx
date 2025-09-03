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
      const data = response.data;
      setBaskets(data.baskets);
      console.log('baskets:', response.data);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  }

  useEffect(() => {
    // fetchBaskets();
      fetchRequests('1');
  }, []);

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


  return (
    <>
      Živeli!
    </>
  )
}

export default App;
