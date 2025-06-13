import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@store';
import {
  checkAuth,
  login,
  logout,
  registration,
  updateUserInfo,
  getOrders
} from '../index';
import * as api from '@utils/burger-api';
import { TAuthResponse, TUserResponse } from '@utils/burger-api';

describe('Тесты асинхронных экшенов userSLice', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Регистрация', async () => {
    const expectedResult: TAuthResponse = {
      success: true,
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
      user: {
        name: 'Name',
        email: 'email@test.com'
      }
    };

    jest.spyOn(api, 'registerUserApi').mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(
      registration({
        name: 'Name',
        email: 'email@test.com',
        password: '12qwaszx'
      })
    );

    const { user, isAuth, isLoading } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
    expect(isAuth).toBe(true);
    expect(isLoading).toBe(false);
  });

  test('Логин', async () => {
    const expectedResult: TAuthResponse = {
      success: true,
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
      user: {
        name: 'Name',
        email: 'email@test.com'
      }
    };

    jest.spyOn(api, 'loginUserApi').mockResolvedValue(expectedResult);

    const store = configureStore({ reducer: rootReducer });

    await store.dispatch(
      login({
        email: 'email@test.com',
        password: '12qwaszx'
      })
    );

    const { user, isAuth, isLoading } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
    expect(isAuth).toBe(true);
    expect(isLoading).toBe(false);
  });

  test('Логин: pending - rejected', async () => {
    jest.spyOn(api, 'loginUserApi').mockRejectedValue(new Error('fail'));

    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
        })
    });

    const actionPromise = store.dispatch(
      login({ email: 'err', password: 'err' })
    );

    let state = store.getState().user;
    expect(state.isLoading).toBe(true);

    await actionPromise;

    const { isAuth, isLoading, user } = store.getState().user;

    expect(isAuth).toBe(false);
    expect(isLoading).toBe(false);
    expect(user).toBe(null);
  });

  test('Логаут', async () => {
    jest.spyOn(api, 'logoutApi').mockResolvedValue({
      success: true
    });

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(logout());

    const { user, isAuth, isLoading } = store.getState().user;

    expect(user).toBe(null);
    expect(isAuth).toBe(false);
    expect(isLoading).toBe(false);
  });

  test('Получить юзера', async () => {
    const expectedResult: TUserResponse = {
      success: true,
      user: {
        name: 'Name',
        email: 'email@test.com'
      }
    };

    jest.spyOn(api, 'getUserApi').mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(checkAuth());

    const { user, isAuth, isLoading } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
    expect(isAuth).toBe(true);
    expect(isLoading).toBe(false);
  });

  test('Обновить данные юзера', async () => {
    const expectedResult: TUserResponse = {
      success: true,
      user: {
        name: 'Name',
        email: 'email@test.com'
      }
    };

    jest.spyOn(api, 'updateUserApi').mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(
      updateUserInfo({
        name: 'Name',
        email: 'email@test.com',
        password: '12qwaszx'
      })
    );

    const { user, isAuth, isLoading } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
    expect(isAuth).toBe(true);
    expect(isLoading).toBe(false);
  });

  test('Получить заказы юзера', async () => {
    jest.spyOn(api, 'getOrdersApi').mockResolvedValue([
      {
        _id: 'test_order_id',
        status: 'done',
        name: 'Test Order',
        createdAt: '2025-06-13T10:00:00.000Z',
        updatedAt: '2025-06-13T10:00:00.000Z',
        number: 1234,
        ingredients: ['643d69a5c3f7b9001cfa093c']
      }
    ]);

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(getOrders());

    const { orders } = store.getState().user;

    expect(orders.length).toBeGreaterThan(0);
  });
});
