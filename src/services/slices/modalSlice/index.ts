import { createSlice } from '@reduxjs/toolkit';

export type TModalState = {
  isOpen: boolean;
};

const initialState: TModalState = {
  isOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    }
  },
  selectors: {
    isOpenSelector: (state) => state.isOpen
  }
});

export const { isOpenSelector } = modalSlice.selectors;
export const { openModal, closeModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
