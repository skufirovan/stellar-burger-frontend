import { useSelector } from '@store';
import { ordersSelector } from '@slices/userSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(ordersSelector);

  return <ProfileOrdersUI orders={orders} />;
};
