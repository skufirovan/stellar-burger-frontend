import store from '../store';
import { TUserState } from '@slices/userSlice';
import { TModalState } from '@slices/modalSlice';
import { TConstructorState } from '@slices/burgerConstructorSlice';

describe('Инициализация хранилища', () => {
  test('Инициализация user slice', () => {
    const state = store.getState().user;

    const expected: TUserState = {
      user: null,
      orders: [],
      isAuth: false,
      isLoading: false
    };

    expect(state).toEqual(expected);
  });

  test('Инициализация modal slice', () => {
    const state = store.getState().modal;

    const expected: TModalState = {
      isOpen: false
    };

    expect(state).toEqual(expected);
  });

  test('Инициализация burgerConstructor slice', () => {
    const state = store.getState().burgerConstructor;

    const expected: TConstructorState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };

    expect(state).toEqual(expected);
  });

  test('Инициализация burger slice', () => {
    const state = store.getState().burger;

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('ordersInfo');
    expect(state).toHaveProperty('isLoading');
    expect(state).toHaveProperty('error');

    expect(Array.isArray(state.ingredients)).toBe(true);
    expect(Array.isArray(state.orders)).toBe(true);
    expect(typeof state.ordersInfo.total).toBe('number');
    expect(typeof state.ordersInfo.totalToday).toBe('number');
  });
});
