import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { RootState } from '@store';
import { orderBurgerApi, TNewOrderResponse } from '@utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils/types';

export const orderBurger = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { state: RootState }
>('order/fetch', async (data: string[], thunkAPI) => {
  try {
    const res = await orderBurgerApi(data);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

export type TConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    clearBurgerConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newItem: TConstructorIngredient = {
        ...action.payload,
        id: nanoid()
      };

      if (newItem.type === 'bun') {
        state.constructorItems.bun = newItem;
      } else {
        state.constructorItems.ingredients.push(newItem);
      }
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredientToDelete = action.payload;

      if (ingredientToDelete.type === 'bun') {
        state.constructorItems.bun = null;
      } else {
        state.constructorItems.ingredients =
          state.constructorItems.ingredients.filter(
            (item) => item.id !== ingredientToDelete.id
          );
      }
    },
    moveUpIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredientToMove = action.payload;

      if (ingredientToMove.type === 'bun') {
        return;
      }

      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === ingredientToMove.id
      );

      if (index > 0) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    moveDownIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const ingredientToMove = action.payload;

      if (ingredientToMove.type === 'bun') {
        return;
      }

      const ingredients = state.constructorItems.ingredients;
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === ingredientToMove.id
      );

      if (index > -1 && index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    }
  },
  selectors: {
    constructorItemsSelector: (state) => state.constructorItems,
    orderRequestSelector: (state) => state.orderRequest,
    orderModalDataSelector: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;
export const {
  constructorItemsSelector,
  orderRequestSelector,
  orderModalDataSelector
} = burgerConstructorSlice.selectors;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
