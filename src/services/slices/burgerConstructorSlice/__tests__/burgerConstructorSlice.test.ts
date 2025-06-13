import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@store';
import {
  burgerConstructorReducer,
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearBurgerConstructor,
  TConstructorState,
  orderBurger
} from '../index';
import * as api from '@utils/burger-api';
import { TNewOrderResponse } from '@utils/burger-api';

describe('Тесты редьюсеров burgerConstructorSLice', () => {
  const initialState: TConstructorState = {
    constructorItems: {
      bun: {
        id: 'test_id_1',
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      },
      ingredients: [
        {
          id: 'test_id_2',
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        {
          id: 'test_id_3',
          _id: '643d69a5c3f7b9001cfa0942',
          name: 'Соус Spicy-X',
          type: 'sauce',
          proteins: 30,
          fat: 20,
          carbohydrates: 40,
          calories: 30,
          price: 90,
          image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png'
        }
      ]
    },
    orderRequest: false,
    orderModalData: null
  };

  let state: TConstructorState;
  beforeEach(() => {
    state = JSON.parse(JSON.stringify(initialState));
  });

  test('Добавить ингредиент', () => {
    const ingredientToAdd = {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    };
    const newState = burgerConstructorReducer(
      state,
      addIngredient(ingredientToAdd)
    );

    const { constructorItems } = newState;
    const added = constructorItems.ingredients[2];
    const { id, ...rest } = added;

    expect(rest).toEqual(ingredientToAdd);
  });

  test('Добавить булочку', () => {
    const ingredientToAdd = {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    };
    const newState = burgerConstructorReducer(
      state,
      addIngredient(ingredientToAdd)
    );

    const { constructorItems } = newState;

    expect(constructorItems.bun?._id).toBe(ingredientToAdd._id);
  });

  test('Удалить ингредиент', () => {
    const ingredientToDelete = state.constructorItems.ingredients[0];
    const newState = burgerConstructorReducer(
      state,
      deleteIngredient(ingredientToDelete)
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients.length).toBe(1);
  });

  test('Удалить булочку', () => {
    const ingredientToDelete = state.constructorItems.bun;
    const newState = burgerConstructorReducer(
      state,
      deleteIngredient(ingredientToDelete!)
    );

    const { constructorItems } = newState;

    expect(constructorItems.bun).toBe(null);
  });

  test('Опустить ингредиент вниз', () => {
    const ingredientToMoveDown = state.constructorItems.ingredients[0];
    const newState = burgerConstructorReducer(
      state,
      moveDownIngredient(ingredientToMoveDown)
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients).toEqual([
      state.constructorItems.ingredients[1],
      state.constructorItems.ingredients[0]
    ]);
  });

  test('Поднять ингредиент вверх', () => {
    const ingredientToMoveUp = state.constructorItems.ingredients[1];
    const newState = burgerConstructorReducer(
      state,
      moveUpIngredient(ingredientToMoveUp)
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients).toEqual([
      state.constructorItems.ingredients[1],
      state.constructorItems.ingredients[0]
    ]);
  });

  test('Очистиь конструктор', () => {
    const newState = burgerConstructorReducer(state, clearBurgerConstructor());

    const { constructorItems } = newState;

    expect(constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });
});

describe('Тесты асинхронных экшенов burgerConstructorSLice', () => {
  test('Сделать заказ', async () => {
    const expectedResult: TNewOrderResponse = {
      success: true,
      order: {
        _id: 'test_order_id',
        status: 'done',
        name: 'Name',
        createdAt: '2025-06-13T10:00:00.000Z',
        updatedAt: '2025-06-13T10:00:00.000Z',
        number: 1234,
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0945',
          '643d69a5c3f7b9001cfa0947',
          '643d69a5c3f7b9001cfa093c'
        ]
      },
      name: 'Name'
    };

    jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: rootReducer
    });

    await store.dispatch(
      orderBurger([
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa0947',
        '643d69a5c3f7b9001cfa093c'
      ])
    );

    const { orderModalData, orderRequest } = store.getState().burgerConstructor;

    expect(orderModalData?.ingredients).toEqual(
      expectedResult.order.ingredients
    );
    expect(orderRequest).toBe(true);
  });
});
