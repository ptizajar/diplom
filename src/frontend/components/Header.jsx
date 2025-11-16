import React from "react";
import { Link } from "react-router-dom";
import "../reset.css";
import "./header.css";
import { EnterForm } from "./EnterForm";
import { showDialog } from "./Dialog";
function Header() {
  return (
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
        <Link onClick={() => showDialog(EnterForm)} className="menu-link">
          <li className="menu-item">
            <img src="/public/login.svg" className="menu-icon"></img>
            Войти
          </li>
        </Link>
        <Link to={"/favourites"} className="menu-link">
          <li className="menu-item">
            <img src="/public/favourites.svg" className="menu-icon"></img>
            Избранное
          </li>
        </Link>
        <Link to={"/admin"} className="menu-link">
          <li className="menu-item">
            <img src="/public/admin.svg" className="menu-icon"></img>
            Управление
          </li>
        </Link>
      </ul>
    </nav>
  );
}

export default Header;
