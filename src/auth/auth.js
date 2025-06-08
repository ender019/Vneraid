import React, { useState } from 'react';
import Login from './login';
import Registration from './registration';

import '../static/auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='auth-container'>
      {isLogin ? (
        <Login onSwitch={() => setIsLogin(false)} />
      ) : (
        <Registration onSwitch={() => setIsLogin(true)} />
      )}
      <div className="auth-switch">
        {isLogin ? (
          <div className='switch'>Нет аккаунта?<div onClick={() => setIsLogin(false)}>Регистрация</div></div>
        ) : (
          <div className='switch'>Уже есть аккаунт?<div onClick={() => setIsLogin(true)}>Войти</div></div>
        )}
      </div>
    </div>
  );
};

export default Auth;