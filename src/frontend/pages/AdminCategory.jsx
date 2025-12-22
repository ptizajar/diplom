import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddItemForm } from "../components/AddItemForm";
import AdminItemCard from "../components/AdminItemCard";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import { showDialog } from "../components/Dialog";
import "../css/itemCard.css"
import { forAdminOnly } from "../components/ForAdminOnly";
import "../css/toast.css"

function AdminCategory() {
  const { category_id } = useParams();
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState(null);
  const [items, setItems] = useState([]);


  async function loadCategory() {
    const res = await fetch(`${backend}/api/category/${category_id}`);
    if (!res.ok) {
      const err = await response.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setCategoryName(data.category_name);
  }

  async function loadItems() {
    const res = await fetch(`${backend}/api/category/${category_id}/items`);
    if (!res.ok) {
      const err = await response.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setItems(data);
  }
  useEffect(() => { loadCategory() }, []);
  useEffect(() => { loadItems() }, []);


  return (
    <>
      <p>{categoryName}</p>
      <button onClick={() => showDialog(AddItemForm, { category_id }, loadItems)}>Добавить товар</button>
      <div className="card-holder">
        {items.map((item) => (

          <AdminItemCard
            key={item.item_id}
            item_id={item.item_id}
            name={item.item_name}
            price={item.price}
            liked={item.liked}
            onClose={loadItems}
          ></AdminItemCard>

        ))}
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

export default forAdminOnly(AdminCategory);
