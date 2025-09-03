import type {Basket} from "../types";

interface MyBasketsContainerProps {
  baskets: Basket[];
  onBasketClick: (id: string) => void;
}

const MyBasketsContainer = ({
                              baskets,
                              onBasketClick
}: MyBasketsContainerProps) => {
  return (
    <>
      <div id='basket-container'>
        <h2>My Baskets</h2>
        <table>
          <tbody>
          {baskets.map(basket => {
            return (
              <tr>
                <td className='basket_list_item' onClick={() => onBasketClick(String(basket.id))}>
                  <h3>{basket.basket_path}</h3>
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