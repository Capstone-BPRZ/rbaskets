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

  const baseURL = '';

  useEffect(() => {
    fetchBaskets();
  }, []);

  // fetch all the baskets that belong to a user
  const fetchBaskets = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/baskets`);
      console.log(response)
      const baskets: Basket[] = response.data.baskets;
      setBaskets(baskets);
      console.log('baskets:', baskets);
    } catch (error) {
      console.error("Error fetching baskets:", error);
    }
  }

  // given a basket id (an integer formatted as a string) fetch all the requests belonging to a basket
  const fetchRequests = async (currentBasket: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/baskets/${currentBasket}/requests`
      );
      const requestsData = response.data.requests
      setRequests(requestsData);
      console.log(`requests for basket ${currentBasket}:`, requestsData);
    } catch (e) {
      console.log(e)
    }
  }

  // delete a specific basket
  const deleteBasket = async (basket: Basket) => {
    try {
      if (!window.confirm(`Are you sure you want to delete basket "${basket.basket_path}"? This action cannot be undone.`)) {
        return;
      }

      await axios.delete(`${baseURL}/api/baskets/${basket.basket_path}`);

      setBaskets(prevBaskets => prevBaskets.filter(b => b.id !== basket.id));

      console.log(`Successfully deleted basket: ${basket.basket_path}`);
    } catch (error) {
      console.error("Error deleting basket: ", error);
      alert("Failed to delete basket. Please try again.");
    }
  }

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
    <Routes>
      <Route path='/' element={
        <>
          <div>
            <h1>rBaskets</h1>
          </div>
          <Modal
            handleToggle={toggleModal}
            isModalOpen={isModalOpen}
            newBasketPath={newBasketPath}/><MyBasketsContainer
          baskets={baskets}
          onDeleteBasket={deleteBasket}/><CreateBasketButton onCreateClick={addBasket}/></>
      }
    ></Route>
    <Route path="/baskets/:basket_path" element={<BasketPage requests={requests} fetchRequests={fetchRequests} />} />
    </Routes>
  </Router>

  );
}

export default App;


