const BasketPage = ({ 
  basket,
  currentBasket,
  requests, 
}) => {

  function displayRequests(requests) {
    return (
      requests.map((request, index) => (
        <li key={index} className="all_requests">
          
      )
      )
    )
  }
  return (
    <>
    <div className="basket-header">
      <span className="basket-name">Basket: {currentBasket.basket_path}</span>
      <span className="request-count">Requests: {requests.length}</span>
    </div>
    </>
  )
}