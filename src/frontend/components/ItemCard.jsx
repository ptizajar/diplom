import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/home.css"
import { useSelector } from "react-redux";
import "../css/itemCard.css"
function ItemCard({ item_id, name, price, liked }) {
  const [error, setError] = useState("");
  const [currentLiked, setCurrentLiked] = useState(liked);
  const currentUser = useSelector((state) => state.user.currentUser);
  async function like(e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Login to add favourites");
      return;
    }
    const formData = new FormData();
    formData.append("item_id", item_id);
    formData.append("liked", !currentLiked);
    const response = await fetch(`${backend}/api/favourites`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) {
      const err = await response.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    setCurrentLiked(!currentLiked);
  }
  return (
    <>
      <Link className="item-card" to={`/item/${item_id}`}>
        <div className="item-image-holder" >
          <img className="item-image" src={`${backend}/api/item/image/${item_id}`} alt="товар" />
          <button className="heart-icon" onClick={like}><img src={currentLiked ? "/public/liked.svg" : "/public/favourites.svg"} alt="в избранное" /></button>
        </div>
        <p className="item-name">{name}</p>
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

export default ItemCard;
