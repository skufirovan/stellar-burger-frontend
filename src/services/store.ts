import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userReducer } from '@slices/userSlice';
import { burgerReducer } from '@slices/burgerSlice';
import { modalReducer } from '@slices/modalSlice';
import { burgerConstructorReducer } from '@slices/burgerConstructorSlice';

const rootReducer = combineReducers({
  user: userReducer,
  burger: burgerReducer,
  modal: modalReducer,
  burgerConstructor: burgerConstructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
