import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDidMount } from '@/hooks';
import axiosClientJwt from '../axios/axiosInstance';

const useFeaturedProducts = (params) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [total, setTotal] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const { page, limit, filter } = params;
      const response = await axios.get(
        '/product', {
          params: {
            page,
            limit,
            filter
          }
        },
      );

      if (!response.data.list) {
        if (didMount) {
          setError('Không thể lấy dữ liệu sản phẩm.');
          setLoading(false);
        }
      }

      if (didMount) {
        setFeaturedProducts(response.data.list);
        setTotal(response.data.total);
        setLoading(false);
      }
    } catch (e) {
      if (didMount) {
        setError('Không thể lấy dữ liệu sản phẩm');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (featuredProducts.length === 0 && didMount) {
      fetchFeaturedProducts();
    }
  }, []);

  return {
    featuredProducts, fetchFeaturedProducts, isLoading, error, total
  };
};

export default useFeaturedProducts;
