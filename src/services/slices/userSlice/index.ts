import {
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
import { TUser } from '@utils-types';
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

type TUserState = {
  user: TUser | null;
  isAuth: boolean;
  isLoading: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuth: false,
  isLoading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    userSelector: (state) => state.user,
    isAuthSelector: (state) => state.isAuth,
    isLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isAuth = false;
      })

      .addCase(updateUserInfo.rejected, (state) => {
        state.isLoading = false;
      })

      .addMatcher(
        isAnyOf(
          login.pending,
          registration.pending,
          logout.pending,
          checkAuth.pending,
          updateUserInfo.pending
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

export const { userSelector, isAuthSelector, isLoadingSelector } =
  userSlice.selectors;
export const userReducer = userSlice.reducer;
