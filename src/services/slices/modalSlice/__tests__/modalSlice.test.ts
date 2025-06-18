import { expect, test, describe } from '@jest/globals';
import { closeModal, modalReducer, openModal, TModalState } from '../index';

describe('Тесты редьюсеров modalSLice', () => {
  const initialState: TModalState = {
    isOpen: false
  };

  let state: TModalState;
  beforeEach(() => {
    state = JSON.parse(JSON.stringify(initialState));
  });

  test('Открыть и закрыть модалку', () => {
    let newState = modalReducer(state, openModal());

    expect(newState.isOpen).toEqual(true);

    newState = modalReducer(state, closeModal());

    expect(newState.isOpen).toBe(false);
  });
});
