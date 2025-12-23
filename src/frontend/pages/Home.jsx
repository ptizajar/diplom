import React from "react";
import { useState } from "react";
import {ItemCard} from "../components/ItemCard";
import { backend } from "../api-globals";
import { useEffect } from "react";
import "../css/home.css"
import "../css/itemCard.css"
import "../css/toast.css"

export function Home() {
  const [items, setItems] = useState([]);
  const [error,setError] = useState("");
  async function loadItems() {
    const res = await fetch(`${backend}/api/showed_items`, {credentials: "same-origin"});
     if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setItems(data);
  }
  useEffect(() => { loadItems() }, []);
  return (
    <>
      <p>Главная</p>
      <div className="banner"><p> МАКС-МЕБЕЛЬ - лучшее решение для вашего офиса</p></div>
      <h1 className="title">Хиты продаж</h1>
      <div className="card-holder">
        {items.map(
          (item) =>
            !item.show && (
              <ItemCard
                key={item.item_id}
                item_id={item.item_id}
                name={item.item_name}
                price={item.price}
                liked={item.liked}
              ></ItemCard>
            )
        )}
      </div>
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


