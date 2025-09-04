// import type {Basket} from "../types";

interface CreateBasketButtonProps {
  onCreateClick: () => Promise<void>;
}

const CreateBasketButton =
  ({ onCreateClick }: CreateBasketButtonProps) => {

  return (
    <img
      src="/src/assets/basket-cat.png"
      height="375"
      width="250"
      alt="create"
      onClick={onCreateClick}
    />
  )
}

export default CreateBasketButton;