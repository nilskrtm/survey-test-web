import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { resetUserData } from '../../store/features/user.slice';
import { useNavigate } from 'react-router-dom';

const Logout: () => React.JSX.Element = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetUserData({}));
    navigate('/login');
  }, []);

  return <></>;
};

export default Logout;
