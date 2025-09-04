// @ts-nocheck

import type {Request, Basket} from "../types";

interface BasketPageProps {
  currentBasket: Basket, 
  requests: Request[],
  request: Request,
}

const BasketPage: BasketPageProps = ({ 
  currentBasket,
  requests,
  request, 
}) => {

  function requestCreatedTime(request) {
    const date = new Date(request.received);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  }
  
  function requestCreatedDate(request) {
    const date = new Date(request.received);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  function displayRequests(requests) {
    return (
      requests.map((request, index) => (
        <li key={index} className="all-requests">
          <div className="request-info">
          <span className="request-method">{request.method}</span>
          <span className="request-created-time">{requestCreatedTime(request)}</span>
          <span className="request-created-date">{requestCreatedDate(request)}</span>
          <span className="basket-name-request-list">{currentBasket.basket_path.slice(-8)}</span>
          <span className="request-headers">{request.headers}</span>
          </div>
        </li>
        )
      )
    )
  }

  function displayHeader(currentBasket, requests) {
    return (
      <div className="basket-header">
      <span className="basket-name-header">Basket: {currentBasket.basket_path.slice(-7)}</span>
      <span className="request-count">Requests: {requests.length}</span>
      <span>
        <span className="requests-are-collected">Requests are collected at </span>
        <span className="basket-path">{currentBasket.basket_path}</span>
      </span>
    </div>
    )
  }

  return (
    <>
    {displayHeader(currentBasket, requests)}
    {displayRequests(requests)}
    </>
  )
}

