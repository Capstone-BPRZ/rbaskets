import type {Basket} from "../types";
import { Link } from 'react-router-dom'


interface MyBasketsContainerProps {
  baskets: Basket[],
}

const MyBasketsContainer = ({baskets}: MyBasketsContainerProps) => {
  return (
    <>
      <div id='basket-container'>
        <h2>My Baskets</h2>
        <table>
          <tbody>
          {baskets.map(basket => {
            return (
              <tr key={basket.id}>
                <td className='basket_list_item'>
                  <Link to={`/baskets/${basket.basket_path}`}>{basket.basket_path}</Link>
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