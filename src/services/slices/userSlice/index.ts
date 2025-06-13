import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction
} from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '@utils/cookie';

export const registration = createAsyncThunk(
  'auth/registration',
  async ({ email, name, password }: TRegisterData, thunkAPI) => {
    try {
      const res = await registerUserApi({ email, name, password });
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: TLoginData, thunkAPI) => {
    try {
      const res = await loginUserApi({ email, password });
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    return null;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const checkAuth = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'user/update',
  async ({ email, name, password }: TRegisterData, thunkAPI) => {
    try {
      const res = await updateUserApi({ email, name, password });
      return res.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getOrders = createAsyncThunk(
  'user/orders',
  async (_, thunkAPI) => {
    try {
      const res = await getOrdersApi();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export type TUserState = {
  user: TUser | null;
  orders: TOrder[];
  isAuth: boolean;
  isLoading: boolean;
};

const initialState: TUserState = {
  user: null,
  orders: [],
  isAuth: false,
  isLoading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    userSelector: (state) => state.user,
    ordersSelector: (state) => state.orders,
    isAuthSelector: (state) => state.isAuth,
    isLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.orders = [];
        state.isLoading = false;
        state.isAuth = false;
      })

      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.isLoading = false;
        }
      )

      .addMatcher(
        isAnyOf(updateUserInfo.rejected, getOrders.rejected),
        (state) => {
          state.isLoading = false;
        }
      )

      .addMatcher(
        isAnyOf(
          login.pending,
          registration.pending,
          logout.pending,
          checkAuth.pending,
          updateUserInfo.pending,
          getOrders.pending
        ),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          login.rejected,
          registration.rejected,
          logout.rejected,
          checkAuth.rejected
        ),
        (state) => {
          state.isLoading = false;
          state.isAuth = false;
        }
      )

      .addMatcher(
        isAnyOf(
          login.fulfilled,
          registration.fulfilled,
          checkAuth.fulfilled,
          updateUserInfo.fulfilled
        ),
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isLoading = false;
          state.isAuth = true;
        }
      );
  }
});

export const {
  userSelector,
  isAuthSelector,
  isLoadingSelector,
  ordersSelector
} = userSlice.selectors;
export const userReducer = userSlice.reducer;
