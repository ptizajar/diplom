import React, {  useState } from "react";
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
    } else {
      loadData();
    }

  }
  return (
    <>
      <nav className="header">
        <ul className="header-menu">
          <Link to={"/"} className="menu-link--logo">
            <li className="menu-item--logo">
              <img src="/public/logo.svg" className="menu-icon--logo"></img>
              МАКС-МЕБЕЛЬ
            </li>
          </Link>
          <Link to={"/catalog"} className="menu-link">
            <li className="menu-item">
              <img src="/public/catalog.svg" className="menu-icon"></img>
              Каталог
            </li>
          </Link>
          {!currentUser && <Link onClick={(e) => {e.preventDefault(); showDialog(LoginForm, undefined, loadOrNavigate);}} className="menu-link">
            <li className="menu-item">
              <img src="/public/login.svg" className="menu-icon"></img>
              Войти
            </li>
          </Link>}
          
           {currentUser && !currentUser.is_admin && <Link to={"/account"} className="menu-link">
            <li className="menu-item">
              <img src="/public/login.svg" className="menu-icon"></img>
              Аккаунт
            </li>
          </Link>}
          <Link to={"/favourites"} className="menu-link">
            <li className="menu-item">
              <img src="/public/favourites.svg" className="menu-icon"></img>
              Избранное
            </li>
          </Link>
          {currentUser?.is_admin && <Link to={"/admin"} className="menu-link">
            <li className="menu-item">
              <img src="/public/admin.svg" className="menu-icon"></img>
              Управление
            </li>
          </Link>}
           {currentUser?.is_admin && <Link to={"/bids"} className="menu-link">
            <li className="menu-item">
              <img src="/public/admin.svg" className="menu-icon"></img>
              Заявки
            </li>
          </Link>}
        </ul>
      </nav>
      {error && (
        <div className="toast-notification">
          <div className="toast-content">
            <span className="toast-message">{error}</span>
            <button onClick={()=>setError("")} className="toast-close">×</button>
          </div>
          {/* Прогресс-бар для автоскрытия */}
          <div className="toast-progress"></div>
        </div>
      )}
    </>

  );
}

