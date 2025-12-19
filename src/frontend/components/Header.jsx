import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../reset.css";
import "../css/header.css";
import "../css/toast.css";
import { LoginForm } from "./LoginForm";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store";

function Header() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  async function logout(e) {
    e.preventDefault();
    setError("");

    const response = await fetch(`${backend}/api/logout`, {
      method: 'POST'

    });
    if (!response.ok) {
      const err = await response.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    dispatch(setUser(null))
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
          {!currentUser && <Link onClick={() => showDialog(LoginForm)} className="menu-link">
            <li className="menu-item">
              <img src="/public/login.svg" className="menu-icon"></img>
              Войти
            </li>
          </Link>}
          {currentUser && <Link onClick={logout}>Logout</Link>}
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

export default Header;
