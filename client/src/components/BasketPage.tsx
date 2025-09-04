// @ts-nocheck

const BasketPage = ({ 
  basket,
  currentBasket,
  requests, 
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
          <span className="basket-name-request-list">{currentBasket.basket_path}</span>
          <span className="request-headers">{request.headers}</span>
          </div>
        </li>
        )
      )
    )
  }

  return (
    <>
    <div className="basket-header">
      <span className="basket-name-header">Basket: {currentBasket.basket_path}</span>
      <span className="request-count">Requests: {requests.length}</span>
    </div>
    <div className="request"
    </>
  )
}