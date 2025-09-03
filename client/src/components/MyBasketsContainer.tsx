import type {Basket} from "../types";
import { Link } from 'react-router-dom'


interface MyBasketsContainerProps {
  baskets: Basket[],
  onBasketClick: (id: string) => void,
}

const MyBasketsContainer = ({
                              baskets,
                              onBasketClick,
                            }: MyBasketsContainerProps) => {
  return (
    <>
      <div id='basket-container'>
        <h2>My Baskets</h2>
        <table>
          <tbody>
          {baskets.map(basket => {
            return (
              <tr key={basket.id}>
                <td className='basket_list_item' onClick={() => onBasketClick(String(basket.id))}>
                  <Link to={`/baskets/${basket.id}`}>{basket.basket_path}</Link>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MyBasketsContainer;