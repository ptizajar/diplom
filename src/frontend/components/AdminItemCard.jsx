import React from "react";
import { Link, useParams } from "react-router-dom";
import ItemCard from "./ItemCard";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { AddItemForm } from "./AddItemForm";
function AdminItemCard({ item_id, name, price, onClose }) {

  async function deleteItem() {
    await fetch(`${backend}/api/admin/delete_item/${item_id}`, {
      method: 'delete'
    })

  }
  return (
    <div>
      <ItemCard item_id={item_id} name={name} price={price} />
      <button onClick={() => showDialog(AddItemForm, { item_id, onClose })}>Edit</button>
      <button onClick={deleteItem} >Delete</button>
    </div>
  );
}

export default AdminItemCard;
