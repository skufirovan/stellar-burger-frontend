import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@store';
import { fetchFeeds, fetchIngredients } from '../index';
import * as api from '@utils/burger-api';
import { ingredientsFromApi } from '../__mocks__/mocks';

describe('Тесты асинхронных экшенов burgerSLice', () => {
  test('Получить список ингредиентов', async () => {
    const expectedResult = ingredientsFromApi;

    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(fetchIngredients());

    const { ingredients } = store.getState().burger;

    expect(ingredients).toEqual(ingredientsFromApi);
  });

  test('Получиь список всех заказов', async () => {
    jest.spyOn(api, 'getFeedsApi').mockResolvedValue({
      success: true,
      orders: [
        {
          _id: 'test_order_id',
          status: 'done',
          name: 'Test Order',
          createdAt: '2025-06-13T10:00:00.000Z',
          updatedAt: '2025-06-13T10:00:00.000Z',
          number: 1234,
          ingredients: ['643d69a5c3f7b9001cfa093c']
        }
      ],
      total: 1,
      totalToday: 1
    });

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(fetchFeeds());

    const { orders } = store.getState().burger;

    expect(orders.length).toBeGreaterThan(0);
  });
});
