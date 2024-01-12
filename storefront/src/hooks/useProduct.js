import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDidMount } from '@/hooks';

const useProduct = (id) => {
  // get and check if product exists in store
  const storeProduct = useSelector((state) => state.products.items.find((item) => item.id === id));

  const [product, setProduct] = useState(storeProduct);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(() => {
    (async () => {
      try {
        if (!product || product.id !== id) {
          setLoading(true);
          const response = await axios.get(
            `/product-detail/${id}`,
          );

          if (!response.data) {
            if (didMount) {
              setError('Không thể lấy dữ liệu sản phẩm.');
              setLoading(false);
            }
          }

          if (didMount) {
            setProduct(response.data);
            setLoading(false);
          }
        }
      } catch (err) {
        if (didMount) {
          setLoading(false);
          setError(err?.message || 'Something went wrong.');
        }
      }
    })();
  }, [id]);

  return {
    product, isLoading, error
  };
};

export default useProduct;
