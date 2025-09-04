interface CreateBasketButtonProps {
  onCreateClick: () => Promise<void>;
}

const CreateBasketButton =
  ({ onCreateClick }: CreateBasketButtonProps) => {

  return (
    <>
      <h2>Create a New Basket</h2><img
      src="/src/assets/basket-cat.png"
      height="375"
      width="250"
      alt="create"
      onClick={onCreateClick}/>
    </>
  )
}

export default CreateBasketButton;