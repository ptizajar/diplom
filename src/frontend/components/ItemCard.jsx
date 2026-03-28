import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import { useDispatch, useSelector } from "react-redux";
import i from  "../css/.module/itemCard.module.css"
import { showDialog } from "./Dialog";
import { SessionExpired } from "./SessionExpired";
import { setUser } from "../store";
import { LoginForm } from "./LoginForm";
export function ItemCard({ item_id, name, price, liked, length, width, height, removed }) {
  const [error, setError] = useState("");
  const [currentLiked, setCurrentLiked] = useState(liked);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  async function like(e) {
    e.preventDefault();
    if (!currentUser) {
      showDialog(LoginForm)
      return;
    }
    const formData = new FormData();
    formData.append("item_id", item_id);
    formData.append("liked", !currentLiked);
    const res = await fetch(`${backend}/api/favourites`, {
      method: 'POST',
      body: formData
    })
    if (res.status === 401) {
      showDialog(SessionExpired, undefined, () => { dispatch(setUser(null)); navigate('/') });
      onCloseClick();
      return;
    }
    if (!res.ok && res.status !== 401) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    setCurrentLiked(!currentLiked);
  }
  const style = removed ? { filter: "grayscale(100%)" } : {};
  return (
    <>
      <Link className={i.card} to={`/item/${item_id}`}>
        <div className={i.imageHolder} >
          <img className={i.image} src={`${backend}/api/item/image/${item_id}`} style={style} alt="товар" />
          <button className={i.icon} onClick={like}><img src={currentLiked ? "/public/liked.svg" : "/public/heart.svg"} alt="в избранное" /></button>
        </div>
        <p className={i.name}>{name}</p>
        <p className={i.size}>{length} х {width} х {height} см</p>
        <p className={i.price}>{price} ₽</p>
      </Link>

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


