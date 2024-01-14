import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket as dispatchAddToBasket, removeFromBasket } from '@/redux/actions/basketActions';
import axios from 'axios';

const useBasket = () => {
  const { basket } = useSelector((state) => ({ basket: state.basket }));
  const dispatch = useDispatch();

  const isItemOnBasket = (id) => !!basket.find((item) => item.productDetail.id === id);

  const addToBasket = async (product) => {
    const access_token = localStorage.getItem("access_token")
   try {
    const response = await axios.post(
      `/cart-detail?productDetailId=${product.id}`, null ,{
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );
    // console.log("object product", response);
    dispatch(dispatchAddToBasket({
      productDetail: {
        ...product,
        cartQuantity: 1
      }
    }));
    displayActionMessage('Thêm vào giỏ hàng thành công', 'success');
   } catch (error) {
    // console.log(error);
    displayActionMessage(`${error.response.data}`, 'info')
   }
   
    // if (isItemOnBasket(product.id)) {
    //   // dispatch(removeFromBasket(product.id));
    //   displayActionMessage('Sản phẩm đã có trong giỏ hàng', 'info');
    // } else {
    //   
    //   displayActionMessage('Thêm vào giỏ hàng thành công', 'success');
    // }
  };

  return { basket, isItemOnBasket, addToBasket };
};

export default useBasket;
