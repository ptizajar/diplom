import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ItemCard from "./ItemCard";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { AddItemForm } from "./AddItemForm";
import "../css/itemCard.css"
import "../css/toast.css"
function AdminItemCard({ item_id, name, price, onClose }) {
  const [error, setError] = useState("");

  async function deleteItem() {
    setError("");
    await fetch(`${backend}/api/admin/delete_item/${item_id}`, {
      method: 'delete'
    });
    if (!response.ok) {
      const err = await response.json();
      setError(err.error);
      return;
    }

    onClose();

  }
  return (
    <>
      <div>
        <ItemCard item_id={item_id} name={name} price={price} />
        <div className="admin-button-holder">
          <button className="admin-item-button" onClick={() => showDialog(AddItemForm, { item_id }, onClose)}>Редактировать</button>
          <button className="admin-item-button" onClick={deleteItem} >Удалить</button>
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

export default AdminItemCard;
