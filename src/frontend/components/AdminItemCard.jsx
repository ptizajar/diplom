import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ItemCard } from "./ItemCard";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { AddItemForm } from "./AddItemForm";
import i from "../css/.module/itemCard.module.css"
import "../css/toast.css"
export function AdminItemCard({ item_id, name, price, onClose, liked, removed, length, width, height, }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function deleteItem() {
    setError("");
    const res = await fetch(`${backend}/api/admin/delete_item/${item_id}`, {
      method: 'delete'
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    onClose();
  }

  async function removeItem() {
    setError("");
    const res = await fetch(`${backend}/api/admin/remove_item/${item_id}`, {
      method: 'post'
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    onClose();
  }
  return (
    <>
      <div className={i.cardWrapper}>
        <ItemCard
          item_id={item_id}
          name={name}
          price={price}
          liked={liked}
          removed={removed}
          width={width}
          height={height}
          length={length} />
        <div className={i.adminButtonHolder}>
          <button className={i.adminButton} onClick={() => showDialog(AddItemForm, { item_id }, onClose)}>Редактировать</button>
          <button className={i.adminButton} onClick={removeItem} >{removed ? 'Открыть' : 'Скрыть'}</button>
          <button className={i.adminButton} onClick={() => navigate(`/price_history/${item_id}`)}>История цен</button>
          <button className={i.adminButton} style={{ backgroundColor: "#B71C1C" }} onClick={deleteItem} >Удалить</button>
        </div>
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
      )}</>
  );
}


