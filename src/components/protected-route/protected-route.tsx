import { Navigate } from 'react-router';
import { useSelector } from '@store';
import { isLoadingSelector, userSelector } from '@slices/userSlice/userSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(userSelector);
  const isLoading = useSelector(isLoadingSelector);

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to='/profile' />;
  }

  return children;
};
