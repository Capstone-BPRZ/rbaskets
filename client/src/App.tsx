import { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import type {Basket, Request} from "./types";
import MyBasketsContainer from "./components/MyBasketsContainer.tsx";

import BasketPage from "./components/BasketPage";
import CreateBasketButton from "./components/CreateBasketButton.tsx";
import Modal from "./components/Modal.tsx";



function App() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBasketPath, setNewBasketPath] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);

  const baseURL = 'http://localhost:3000';

  useEffect(() => {
    fetchBaskets();
    fetchRequests('1');
  }, []);

  // fetch all the baskets that belong to a user
  const fetchBaskets = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/baskets`);
      console.log(response)
      const baskets: Basket[] = response.data.baskets;
      setBaskets(baskets);
      setCurrentBasket(baskets[0] || null);
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

  // const deleteBasket = async (basket: Basket) => {
  //   await axios.delete(`/api/baskets/${basket.id}`);
  //   fetchBaskets();
  // }

  // creates a basket and adds it to the database
  const addBasket = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/baskets/create`);
      setNewBasketPath(response.data.basket_path)
      await fetchBaskets()
      toggleModal()
      console.log(response.data)
    } catch (error) {
      console.error("Error creating basket: ", error);
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <Router>
      <div>
        <h1>rBaskets</h1>
      </div>
      <Modal handleToggle={toggleModal} isModalOpen={isModalOpen} newBasketPath={newBasketPath}></Modal>
      <MyBasketsContainer baskets={baskets}/>
      <CreateBasketButton onCreateClick={addBasket}/>

      <Routes>
        {/*<Route path="/baskets/:id`" element={<BasketPage requests={requests}></BasketPage>}></Route>*/}
      </Routes>
    </Router>
  )
}

export default App;
