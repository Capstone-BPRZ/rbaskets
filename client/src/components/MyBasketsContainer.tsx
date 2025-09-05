import type { Basket } from "../types";
import { Link } from "react-router-dom";

interface MyBasketsContainerProps {
  baskets: Basket[];
  onDeleteBasket: (basket: Basket) => void;
  onSelectBasket: (basket: Basket) => void;
}

const MyBasketsContainer = ({ baskets, onDeleteBasket, onSelectBasket }: MyBasketsContainerProps) => {
  return (
    <div id="basket-container">
      <h2>My Baskets</h2>
      <table>
        <tbody>
          {baskets.map(basket => (
            <tr key={basket.id}>
              <td
                className="basket_list_item"
                onClick={() => onSelectBasket(basket)}
              >
                🧺 <Link to={`/baskets/${basket.basket_path}`}>{basket.basket_path}</Link>
              </td>
              <td className="basket_delete_button">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteBasket(basket);
                  }}
                  className="delete-button"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBasketsContainer;