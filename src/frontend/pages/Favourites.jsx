import React from "react";
import { useState } from "react";
import ItemCard from "../components/ItemCard";
import { backend } from "../api-globals";
import { useEffect } from "react";
import "../css/itemCard.css"
import "../css/toast.css"

function Favourites() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  async function loadItems() {
    const res = await fetch(`${backend}/api/liked_items`);
    if (!res.ok) {
      const err = await response.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setItems(data.favourites);
  }
  useEffect(() => { loadItems() }, []);

  return (
    <>
      <p>Избранное</p>
   
      {!items.length ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>В избранном ничего нет</h3>
          <p>Добавляйте товары в избранное, нажимая на ❤️</p>
        </div>
      ) : (
        <div className="card-holder">
          {items.map(item => (
            <ItemCard
              key={item.item_id}
              item_id={item.item_id}
              name={item.item_name}
              price={item.price}
              liked={item.liked}
            />
          ))}
        </div>
      )}
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

export default Favourites;
