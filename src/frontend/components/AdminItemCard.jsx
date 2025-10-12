import React from "react";
import { Link } from "react-router-dom";
import ItemCard from "./ItemCard";
function AdminItemCard({ itemId, name, size, price }) {
  return (
    <div>
      <ItemCard itemId={itemId} name={name} size={size} price={price} />
      <button>Edit</button>
      <button>Delete</button>
    </div>
  );
}

export default AdminItemCard;
