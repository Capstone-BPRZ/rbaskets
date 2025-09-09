import catImg from "../assets/basket-cat.png"

interface CreateBasketButtonProps {
  onCreateClick: () => Promise<void>;
}

const CreateBasketButton =
  ({ onCreateClick }: CreateBasketButtonProps) => {

  return (
    <div id="create-basket-section">
      <h2>Create a New Basket</h2>
      <img
        src={catImg}
        height="375"
        width="250"
        alt="create"
        onClick={onCreateClick}
      />
    </div>
  )
}

export default CreateBasketButton;