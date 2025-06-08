import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

type ModalState = {
  isOpen: boolean;
};

const initialState: ModalState = {
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
