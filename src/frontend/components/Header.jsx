import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../reset.css";
import "../css/header.css";
import { LoginForm } from "./LoginForm";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";

function Header() {
 async function save(e) {
            e.preventDefault();
            
            const response = await fetch(`${backend}/api/logout`, {
                method: 'POST'
    
            });
            if (!response.ok) {
                const err = await response.json();
                setError(err.error);
                return;
            }
        }
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
        <Link onClick={() => showDialog(LoginForm)} className="menu-link">
          <li className="menu-item">
            <img src="/public/login.svg" className="menu-icon"></img>
            Войти
          </li>
        </Link>
        <Link onClick={save}>Logout</Link>
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
