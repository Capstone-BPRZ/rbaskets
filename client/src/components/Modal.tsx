import {Link} from "react-router-dom";

interface ModalProps {
  handleToggle: () => void,
  isModalOpen: boolean,
  newBasketPath: string | null
}

const Modal = ({handleToggle, isModalOpen, newBasketPath}: ModalProps) => {

  return (
    <>
      <div className="modal"
           id="modal-layer"
           onClick={handleToggle}
           style={{display: isModalOpen ? 'block' : 'none'}}/>
      <div className='modal'
           id='modal-content'
           onClick={(e) => e.stopPropagation()}
           style={{display: isModalOpen ? 'block' : 'none'}}
      >
        <h1>Success</h1>
        <p>New Basket {newBasketPath} is created</p>
        <button type='button' onClick={handleToggle}>Close</button>
        <button type='button'>
          <Link to={`/baskets/${newBasketPath}`}>Open Basket</Link>
        </button>

        <div>
        </div>
      </div>
    </>
  )
}

export default Modal;