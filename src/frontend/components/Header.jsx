import React, { useState } from "react";
import { Link } from "react-router-dom";

import h from "../css/.module/header.module.css";
import "../css/toast.css";
import { LoginForm } from "./LoginForm";
import { showDialog } from "./Dialog";
import { useSelector } from "react-redux";

export function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  function loadOrNavigate(action) {
    if (action === 'navigate') {
      dispatch(setUser(null));
      navigate('/')
    }
  }
  return (
    <>
      <nav className={h.header}>
        <ul className={h.menu}>
          <Link to={"/"} className={`${h.link} ${h.linkLogo}`}>
            <li className={`${h.item} ${h.itemLogo}`}>
              <img src="/public/logo.svg" className={h.iconLogo}></img>
             <span>МАКС-МЕБЕЛЬ</span>
            </li>
          </Link>
          <Link to={"/catalog"} className={h.link}>
            <li className={h.item}>
              <img src="/public/catalog.svg" className={h.icon}></img>
              <span>Каталог</span>
            </li>
          </Link>
          {!currentUser && <Link onClick={(e) => { e.preventDefault(); showDialog(LoginForm, undefined, loadOrNavigate); }} className={h.link}>
            <li className={h.item}>
              <img src="/public/account.svg" className={h.icon}></img>
             <span>Войти</span>
            </li>
          </Link>}

          {currentUser && !currentUser.is_admin && <Link to={"/account"} className={h.link}>
            <li className={h.item}>
              <img src="/public/account.svg" className={h.icon}></img>
              <span>Аккаунт</span>
            </li>
          </Link>}
          {currentUser && <Link to={"/favourites"} className={h.link}>
            <li className={h.item}>
              <img src="/public/heart.svg" className={h.icon}></img>
              <span>Избранное</span>
            </li>
          </Link>}
          {currentUser?.is_admin && <Link to={"/admin"} className={h.link}>
            <li className={h.item}>
              <img src="/public/admin.svg" className={h.icon}></img>
              <span>Управление</span>
            </li>
          </Link>}
          {currentUser?.is_admin && <Link to={"/bids"} className={h.link}>
            <li className={h.item}>
              <img src="/public/bids.svg" className={h.icon}></img>
              <span>Заявки</span>
            </li>
          </Link>}
        </ul>
      </nav>
    </>

  );
}

