import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { categories } from "../../../data/data";
import {AdminCategoryCard} from "../components/AdminCategoryCard";
import { showDialog } from "../components/Dialog";
import { AddCategoryForm } from "../components/AddCategoryForm";
import { backend } from "../api-globals";
import "../css/categoryCard.css"
import { forAdminOnly } from "../components/ForAdminOnly";
import "../css/toast.css"

function Admin() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  async function load() {
    const res = await fetch(`${backend}/api/categories`);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    load();
  }, [])

  return (
    <>
      <p>Администрирование</p>
      <button onClick={() => showDialog(AddCategoryForm, undefined, load)}>Добавить категорию</button>
      <Link to="/bids">Заявки</Link>
      <div className="card-holder">
        {categories.map((category) => (
          <AdminCategoryCard
            key={category.category_id}
            category_id={category.category_id}
            name={category.category_name}
            onClose={load}
          ></AdminCategoryCard>
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

export default forAdminOnly(Admin);
