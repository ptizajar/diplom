import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../reset.css";
import "../css/header.css";
import "../css/toast.css";
import { LoginForm } from "./LoginForm";
import { showDialog } from "./Dialog";
import { useSelector } from "react-redux";

export function Header() {
  const [error, setError] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);
  function loadOrNavigate(action) {
    if (action === 'navigate') {
      dispatch(setUser(null));
      navigate('/')
    }
  }
  return (
    <>
      <nav className="header">
        <ul className="header-menu">
          <Link to={"/"} className="menu-link menu-link--logo">
            <li className="menu-item menu-item--logo">
              <img src="/public/logo.svg" className="menu-icon--logo"></img>
             <span>МАКС-МЕБЕЛЬ</span>
            </li>
          </Link>
          <Link to={"/catalog"} className="menu-link">
            <li className="menu-item">
              <img src="/public/catalog.svg" className="menu-icon"></img>
              <span>Каталог</span>
            </li>
          </Link>
          {!currentUser && <Link onClick={(e) => { e.preventDefault(); showDialog(LoginForm, undefined, loadOrNavigate); }} className="menu-link">
            <li className="menu-item">
              <img src="/public/account.svg" className="menu-icon"></img>
             <span>Войти</span>
            </li>
          </Link>}

          {currentUser && !currentUser.is_admin && <Link to={"/account"} className="menu-link">
            <li className="menu-item">
              <img src="/public/account.svg" className="menu-icon"></img>
              <span>Аккаунт</span>
            </li>
          </Link>}
          {currentUser && <Link to={"/favourites"} className="menu-link">
            <li className="menu-item">
              <img src="/public/heart.svg" className="menu-icon"></img>
              <span>Избранное</span>
            </li>
          </Link>}
          {currentUser?.is_admin && <Link to={"/admin"} className="menu-link">
            <li className="menu-item">
              <img src="/public/admin.svg" className="menu-icon"></img>
              <span>Управление</span>
            </li>
          </Link>}
          {currentUser?.is_admin && <Link to={"/bids"} className="menu-link">
            <li className="menu-item">
              <img src="/public/bids.svg" className="menu-icon"></img>
              <span>Заявки</span>
            </li>
          </Link>}
        </ul>
      </nav>
      {error && (
        <div className="toast-notification">
          <div className="toast-content">
            <span className="toast-message">{error}</span>
            <button onClick={() => setError("")} className="toast-close">×</button>
          </div>
          {/* Прогресс-бар для автоскрытия */}
          <div className="toast-progress"></div>
        </div>
      )}
    </>

  );
}

