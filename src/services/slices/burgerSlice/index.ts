import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi, getIngredientsApi, TFeedsResponse } from '@api';
import { TIngredient, TOrder } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await getIngredientsApi();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const fetchFeeds = createAsyncThunk(
  'feeds/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await getFeedsApi();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export type TBurgerState = {
  ingredients: TIngredient[];
  orders: TOrder[];
  ordersInfo: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: null | SerializedError;
};

const loadFromSessionStorage = (): Pick<
  TBurgerState,
  'ingredients' | 'orders' | 'ordersInfo'
> => {
  try {
    const ingredients = JSON.parse(
      sessionStorage.getItem('ingredients') || '[]'
    );
    const orders = JSON.parse(sessionStorage.getItem('orders') || '[]');
    const ordersInfo = JSON.parse(
      sessionStorage.getItem('ordersInfo') || '{"total":0,"totalToday":0}'
    );

    return { ingredients, orders, ordersInfo };
  } catch {
    return {
      ingredients: [],
      orders: [],
      ordersInfo: { total: 0, totalToday: 0 }
    };
  }
};

const sessionData = loadFromSessionStorage();

const initialState: TBurgerState = {
  ...loadFromSessionStorage(),
  isLoading:
    sessionData.ingredients.length === 0 || sessionData.orders.length === 0,
  error: null
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {},
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    ordersSelector: (state) => state.orders,
    ordersInfoSelector: (state) => state.ordersInfo,

    isLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = action.payload;
        sessionStorage.setItem('ingredients', JSON.stringify(action.payload));
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.error = null;
          state.orders = action.payload.orders;
          state.ordersInfo.total = action.payload.total;
          state.ordersInfo.totalToday = action.payload.totalToday;
          sessionStorage.setItem(
            'orders',
            JSON.stringify(action.payload.orders)
          );
          sessionStorage.setItem(
            'ordersInfo',
            JSON.stringify({
              total: action.payload.total,
              totalToday: action.payload.totalToday
            })
          );
        }
      )

      .addMatcher(
        isAnyOf(fetchIngredients.pending, fetchFeeds.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(fetchIngredients.rejected, fetchFeeds.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error;
        }
      );
  }
});

export const {
  ingredientsSelector,
  isLoadingSelector,
  ordersSelector,
  ordersInfoSelector
} = burgerSlice.selectors;
export const burgerReducer = burgerSlice.reducer;
