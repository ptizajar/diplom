import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/home.css"
import { useDispatch, useSelector } from "react-redux";
import "../css/itemCard.css"
import { showDialog } from "./Dialog";
import { EnterForFavourites } from "./EnterForFavourites";
import { SessionExpired } from "./SessionExpired";
import { setUser } from "../store";
export function ItemCard({ item_id, name, price, liked, length, width, height, removed }) {
  const [error, setError] = useState("");
  const [currentLiked, setCurrentLiked] = useState(liked);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  async function like(e) {
    e.preventDefault();
    if (!currentUser) {
      showDialog(EnterForFavourites)
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
      <Link className="item-card" to={`/item/${item_id}`}>
        <div className="item-image-holder" >
          <img className="item-image" src={`${backend}/api/item/image/${item_id}`} style={style} alt="товар" />
          <button className="heart-icon" onClick={like}><img src={currentLiked ? "/public/liked.svg" : "/public/heart.svg"} alt="в избранное" /></button>
        </div>
        <p className="item-name">{name}</p>
        <p className="item-size">{length} х {width} х {height} см</p>
        <p className="item-price">{price} ₽</p>
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


