import { useRef, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { checkAuth, getOrders } from '@slices/userSlice';
import { fetchIngredients, fetchFeeds } from '@slices/burgerSlice';
import { closeModal, isOpenSelector } from '@slices/modalSlice';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { getCookie } from '@utils/cookie';
import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const isModalOpen = useSelector(isOpenSelector);
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (!isCalledRef.current) {
      isCalledRef.current = true;

      const savedIngredients = sessionStorage.getItem('ingredients');
      const savedOrders = sessionStorage.getItem('orders');

      if (!savedIngredients) {
        dispatch(fetchIngredients());
      }

      if (!savedOrders) {
        dispatch(fetchFeeds());
      }

      if (getCookie('accessToken')) {
        dispatch(checkAuth());
        dispatch(getOrders());
      }
    }
  }, [dispatch]);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route index element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<ConstructorPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              isModalOpen && (
                <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                  <IngredientDetails />
                </Modal>
              )
            }
          />
          <Route
            path='/feed/:number'
            element={
              isModalOpen && (
                <Modal title='Детали заказа' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              )
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              isModalOpen && (
                <Modal title='Детали заказа' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              )
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
