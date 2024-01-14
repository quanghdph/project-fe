import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket as dispatchAddToBasket, removeFromBasket } from '@/redux/actions/basketActions';
import axios from 'axios';

const useBasket = () => {
  const { basket } = useSelector((state) => ({ basket: state.basket }));
  const dispatch = useDispatch();

  const isItemOnBasket = (id) => !!basket.find((item) => item.id === id);

  const addToBasket = async (product) => {
    console.log("add", product);
    const access_token = localStorage.getItem("access_token")
    const response = await axios.post(
      `/cart-detail?productDetailId=${product.id}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    console.log(response);

    // if (isItemOnBasket(product.id)) {
    //   // dispatch(removeFromBasket(product.id));
    //   displayActionMessage('Sản phẩm đã có trong giỏ hàng', 'info');
    // } else {
    //   dispatch(dispatchAddToBasket(product));
    //   displayActionMessage('Thêm vào giỏ hàng thành công', 'success');
    // }
  };

  return { basket, isItemOnBasket, addToBasket };
};

export default useBasket;
