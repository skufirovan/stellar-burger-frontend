import { Navigate } from 'react-router';
import { useSelector } from '@store';
import { userSelector } from '@slices/userSlice/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(userSelector);

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to='/profile' />;
  }

  return children;
};
