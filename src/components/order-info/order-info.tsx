import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { ingredientsSelector } from '@slices/burgerSlice';
import { getOrderByNumberApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients = useSelector(ingredientsSelector);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByNumberApi(Number(number));
        setOrderData(res.orders[0] || null);
      } catch (e) {
        setError('Не удалось получить данные заказа');
      } finally {
        setIsLoading(false);
      }
    };

    if (number) {
      fetchOrder();
    }
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsWithCount = orderData.ingredients.reduce(
      (acc, id) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (!ingredient) return acc;

        if (acc[id]) {
          acc[id].count += 1;
        } else {
          acc[id] = { ...ingredient, count: 1 };
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    const total = Object.values(ingredientsWithCount).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo: ingredientsWithCount,
      total,
      date
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
