import { useState, useEffect } from 'react';
import axios from "axios";
import type {Basket, Request} from "./types";


function App() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentBasket, setCurrentBasket] = useState<Basket | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

  const baseURL = 'http://localhost:3000';

  useEffect(() => {
    fetchBaskets();
    console.log('baskets:', baskets);
  }, []);

  const fetchBaskets = async () => {
    try {
      const response = await axios.get<Basket[]>(`${baseURL}/api/baskets`);
      setBaskets(response.data);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  }

  const fetchRequests = async (basket: Basket) => {
    try {
      const response = await axios.get<Request[]>(`/api/baskets/${basket.id}/requests`)
      setRequests(response.data);
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

  return (
    <>
      Živeli!
    </>
  )
}

export default App;
