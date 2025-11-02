import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddItemForm } from "../components/AddItemForm";
import AdminItemCard from "../components/AdminItemCard";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import { showDialog } from "../components/Dialog";

function AdminCategory() {
  const { categoryId } = useParams();

  const [categoryName, setCategoryName] = useState(null);
  const [items, setItems] = useState([]);

  async function loadCategory() {
     const result = await fetch(`${backend}/api/category/${categoryId}`);
    const data = await result.json();
    setCategoryName(data.category_name);
  }

  async function loadItems() {
    const res = await fetch(`${backend}/api/category/${categoryId}/items`);
    const data = await res.json();
    setItems(data);
  }
  useEffect(()=>{loadCategory()}, []);
  useEffect(()=>{loadItems()}, []);


  return (
    <div>
      {categoryName}
      <button onClick={() => showDialog(AddItemForm, {categoryId}, loadItems)}>Add</button>
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item) => (
          <li key={item.item_id}>
            <AdminItemCard
              item_id={item.item_id}
              name={item.item_name}
              price={item.price}
              onClose={loadItems}
            ></AdminItemCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCategory;
