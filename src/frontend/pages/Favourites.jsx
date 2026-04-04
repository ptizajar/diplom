import React, { useState } from "react";
import { ItemCard } from "../components/ItemCard";
import { backend } from "../api-globals";
import { useEffect } from "react";
import i from  "../css/.module/itemCard.module.css";
import f from  "../css/.module/favourites.module.css";
import l from "../css/.module/layout.module.css";
import "../css/toast.css"
import { useSelector } from "react-redux";
import { showDialog } from "../components/Dialog";
import { SessionExpired } from "../components/SessionExpired";

export function Favourites() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);
  async function loadItems() {
    if (!currentUser) {
      return;
    }
    const res = await fetch(`${backend}/api/liked_items`);
    if (res.status === 401) {
      showDialog(SessionExpired);
      return;
    }
    if (!res.ok && res.status !== 401) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    const data = await res.json();
    setItems(data.favourites);
  }
  useEffect(() => { loadItems() }, [currentUser]);

  return (
    <>
      <p className={l.title}>Избранное</p>

      {!items.length && currentUser &&
        <div className={f.noFavourites}>
          <p>В избранном ничего нет</p>
          <p>Добавляйте товары в избранное, нажимая на <img src="/public/heart.svg"></img></p>
        </div>}

      {items.length > 0 && <div className={i.cardHolder}>
        {items.map(item => (
          <ItemCard
            key={item.item_id}
            item_id={item.item_id}
            name={item.item_name}
            width={Math.round(item.width)}
            height={Math.round(item.height)}
            length={Math.round(item.length)}
            price={item.price}
            liked={item.liked}
          />
        ))}
      </div>}


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


