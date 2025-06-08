import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from '@store';
import { openModal } from '@slices/modalSlice';
import { TBurgerIngredientUIProps } from './type';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-ingredient.module.css';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const dispatch = useDispatch();
    const { image, price, name, _id } = ingredient;

    const handleClick = () => {
      dispatch(openModal());
    };
    return (
      <li className={styles.container}>
        <div onClick={handleClick}>
          <Link
            className={styles.article}
            to={`/ingredients/${_id}`}
            state={locationState}
          >
            {count && <Counter count={count} />}
            <img
              className={styles.img}
              src={image}
              alt='картинка ингредиента.'
            />
            <div className={`${styles.cost} mt-2 mb-2`}>
              <p className='text text_type_digits-default mr-2'>{price}</p>
              <CurrencyIcon type='primary' />
            </div>
            <p className={`text text_type_main-default ${styles.text}`}>
              {name}
            </p>
          </Link>
        </div>

        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
