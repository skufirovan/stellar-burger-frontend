import { FC } from 'react';
import { useSelector } from '@store';
import { isOpenSelector } from '@slices/modalSlice';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => {
  const isModalOpen = useSelector(isOpenSelector);

  return (
    <section className={styles.burger_constructor}>
      {constructorItems.bun ? (
        <div
          className={`${styles.element} mb-4 mr-4`}
          data-cy='constructor-top'
        >
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-cy='constructor-top'
        >
          Выберите булки
        </div>
      )}
      <ul className={styles.elements} data-cy='constructor-list'>
        {constructorItems.ingredients.length > 0 ? (
          constructorItems.ingredients.map(
            (item: TConstructorIngredient, index: number) => (
              <BurgerConstructorElement
                ingredient={item}
                index={index}
                totalItems={constructorItems.ingredients.length}
                key={item.id}
              />
            )
          )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}
      </ul>
      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}
      <div
        className={`${styles.total} mt-10 mr-4`}
        data-cy='constructor-order-button'
      >
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
        />
      </div>

      {orderRequest && isModalOpen && (
        <Modal
          onClose={closeOrderModal}
          title={orderModalData ? '' : 'Оформляем заказ...'}
        >
          {orderModalData ? (
            <OrderDetailsUI orderNumber={orderModalData.number} />
          ) : (
            <Preloader />
          )}
        </Modal>
      )}
    </section>
  );
};
