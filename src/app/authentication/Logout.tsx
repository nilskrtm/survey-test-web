import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearTokens, selectLoggedIn } from '../../store/features/authentication.slice';
import { resetUserData } from '../../store/features/user.slice';
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
    dispatch(clearTokens({}));
    dispatch(resetUserData({}));
    navigate('/login');
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 select-none">
      <div className="w-80 md:w-96 p-8 rounded-lg bg-white border-2 border-gray-200">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700">
            {import.meta.env.HTML_TITLE || 'env.HTML_TITLE missing'}
          </p>
        </div>

        <div className="text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light loading-dots">Abmeldung</span>
        </div>
      </div>
    </div>
  );
};

export default Logout;
