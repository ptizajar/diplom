import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddItemForm } from "../components/AddItemForm";
import AdminItemCard from "../components/AdminItemCard";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import { showDialog } from "../components/Dialog";

function AdminCategory() {
  const { category_id } = useParams();

  const [categoryName, setCategoryName] = useState(null);
  const [items, setItems] = useState([]);

  async function loadCategory() {
    const result = await fetch(`${backend}/api/category/${category_id}`);
    const data = await result.json();
    setCategoryName(data.category_name);
  }

  async function loadItems() {
    const res = await fetch(`${backend}/api/category/${category_id}/items`);
    const data = await res.json();
    setItems(data);
  }
  useEffect(() => { loadCategory() }, []);
  useEffect(() => { loadItems() }, []);


  return (
    <div>
      <p>{categoryName}</p>
      <button onClick={() => showDialog(AddItemForm, { category_id }, loadItems)}>Добавить товар</button>
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
