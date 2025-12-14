import React from "react";
import { Link, useParams } from "react-router-dom";
import ItemCard from "./ItemCard";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { AddItemForm } from "./AddItemForm";
import "../css/itemCard.css"
function AdminItemCard({ item_id, name, price, onClose }) {

  async function deleteItem() {
    await fetch(`${backend}/api/admin/delete_item/${item_id}`, {
      method: 'delete'
    })

  }
  return (
    <div>
      <ItemCard item_id={item_id} name={name} price={price} />
      <div className="admin-button-holder">
        <button className="admin-item-button" onClick={() => showDialog(AddItemForm, { item_id }, onClose)}>Редактировать</button>
        <button className="admin-item-button" onClick={deleteItem} >Удалить</button>
      </div>

    </div>
  );
}

export default AdminItemCard;
