import type {Basket} from "../types";

interface CreateBasketButtonProps {
  onCreateClick: () => Basket;
}

const CreateBasketButton =
  ({ onCreateClick }: CreateBasketButtonProps) => {

  return (
    <img
      src="../assets/basket-cat.png"
      alt="create"
      onClick={onCreateClick}
    />
  )
}

export default CreateBasketButton;