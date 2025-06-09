import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { getOrders, isAuthSelector } from '@slices/userSlice';
import { closeModal, openModal } from '@slices/modalSlice';
import {
  constructorItemsSelector,
  orderRequestSelector,
  orderModalDataSelector,
  orderBurger
} from '@slices/burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);
  const isAuth = useSelector(isAuthSelector);

  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login');
    }

    if (constructorItems.bun && constructorItems.ingredients.length) {
      const ingredientsId = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        orderBurger([
          constructorItems.bun._id,
          ...ingredientsId,
          constructorItems.bun._id
        ])
      );
      dispatch(getOrders());
      dispatch(openModal());
    }
  };

  const closeOrderModal = () => {
    dispatch(closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
