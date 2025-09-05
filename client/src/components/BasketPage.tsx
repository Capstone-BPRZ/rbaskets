// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Request } from "../types";

interface BasketPageProps {
  requests: Request[];
  fetchRequests: (basketID: string) => void;
  
}

const BasketPage: React.FC<BasketPageProps> = ({ 
  requests,
  fetchRequests,
}) => {
  const { basket_path } = useParams();
  // under const {basket path}... add these hooks  
  const [expandedRequests, setExpandedRequests] = useState<{[key: string]: boolean}>({}); // state that will be used for toggling a particular request 
  const [expandedSections, setExpandedSections] = useState<{[key: string]: {headers: boolean, body: boolean}}>({}); // state that will be used to toggle a request section. 

  useEffect(() => {
    if (basket_path) { // checks for valid basket_path. if it exists the effect then serves it 
      // 
      fetchRequests(basket_path);
    }
  }, []); 

  
  const toggleRequest = (requestId: string) => {
    setExpandedRequests(prev => ({
      ...prev,  
      [requestId]: !prev[requestId] // swaps the request status of being open or closed 
    }));
  };

  

  // Toggle section (headers or body)
  const toggleSection = (requestId: string, section: 'headers' | 'body') => {
    setExpandedSections(prev => {
      const current = prev[requestId] || { headers: false, body: false }; // sets to false initially as the section will be closed on first visit, but uses the current status first. 
      return {
        ...prev,
        [requestId]: {
          ...current,
          [section]: !current[section]
        }
      };
    });
  };

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

  function getMethodColor(method: string) { // just handles the colors 
    switch (method) {
      case 'GET': return '#4CAF50';
      case 'POST': return '#FF9800';
      case 'PUT': return '#8021f3ff';
      case 'DELETE': return '#F44336';
      default: return '#9e9e9eff';
    }
  }

  function displayRequests(requests) {

    const sortedRequests = requests.sort((a, b)  => { // sorts in descending order by accessing the received property of each request. 
      return new Date(b.received).getTime() - new Date(a.received).getTime(); 
    })
    return (
      sortedRequests.map((request) => {
        const isRequestExpanded = expandedRequests[request.id] || false; // determines if to expand a request 
        const sections = expandedSections[request.id] || { headers: false, body: false }; // same for a section containing a request 
        
        return (
          <li key={request.id} className="all-requests">
            <div 
              className="request-header"
              onClick={() => toggleRequest(request.id)} // section where you toggle a request 
            >
              <span 
                className="request-method"
                style={{ backgroundColor: `rgba(${getMethodColor(request.method).replace('#', '')}, 0.2)`, color: getMethodColor(request.method) }}
              >
                {request.method}
              </span>
              <div className="request-timestamp">
                <div className="request-time">{requestCreatedTime(request)}</div>
                <div className="request-date">{requestCreatedDate(request)}</div>
              </div>
            </div>
            <div className={`request-details ${isRequestExpanded ? 'expanded' : ''}`}>
              <div className="request-section">
                <div 
                  className="request-section-header"
                  onClick={() => toggleSection(request.id, 'headers')}
                >
                  <span className="request-section-title">Headers</span>
                  <span className={`toggle-icon ${sections.headers ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`request-section-content ${sections.headers ? 'expanded' : ''}`}>
                  <div className="headers-content">
                    {request.headers ? JSON.stringify(request.headers, null, 2) : <span className="no-content">No headers</span>}
                  </div>
                </div>
              </div>
              
              <div className="request-section">
                <div 
                  className="request-section-header"
                  onClick={() => toggleSection(request.id, 'body')}
                >
                  <span className="request-section-title">Body</span>
                  <span className={`toggle-icon ${sections.body ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`request-section-content ${sections.body ? 'expanded' : ''}`}>
                  <div className="body-content">
                    {request.body ? request.body : <span className="no-content">No body</span>}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })
    );
  }

  function displayHeader() {
    return (
      <div className="basket-header">
       
        <span className="basket-name-header">Basket: {basket_path}</span>
        <div>
          <span className="request-count">Requests: {requests.length}</span>
          <div>
            <span className="requests-are-collected">Requests are collected at </span>
            <span className="basket-path">{basket_path}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="basket-requests-container">
      <div className="basket-nav-bar">
        <Link to="/" className="nav-link">← Home</Link>
      </div>
      {displayHeader()}
      <ul className="request-list">
        {displayRequests(requests)}
      </ul>
    </div>
  );
};

export default BasketPage;