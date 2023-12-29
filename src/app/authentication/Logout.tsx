import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetUserData, selectLoggedIn } from '../../store/features/user.slice';
import { useNavigate } from 'react-router-dom';

const Logout: () => React.JSX.Element = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else {
      const timeout = setTimeout(() => {
        doLogout();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const doLogout = () => {
    dispatch(resetUserData({}));
    navigate('/login');
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-purple-300 select-none">
      <div className="w-[420px] p-8 rounded-lg bg-white border-2 border-gray-400">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-bold text-purple-800">GBU-SmartData</p>
        </div>

        <div className="text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-semibold loading-dots">
            Abmeldung
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logout;
