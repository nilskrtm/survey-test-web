import React, { FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectLoggedIn } from '../../store/features/user.slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const Login: () => React.JSX.Element = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);

  const login = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="h-full w-full flex justify-center items-center bg-purple-900 select-none">
      <div className="w-[420px] p-8 rounded-lg bg-purple-800 border-2 border-purple-950">Login</div>
    </div>
  );
};

export default Login;
