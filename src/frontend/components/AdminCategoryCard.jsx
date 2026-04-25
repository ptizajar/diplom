import React, { useState } from "react";
import { Link } from "react-router-dom";
import {CategoryCard} from "./CategoryCard";
import { AddCategoryForm } from "./AddCategoryForm";
import { showDialog } from "./Dialog";
import c from "../css/.module/categoryCard.module.css"
import "../css/toast.css"

export function AdminCategoryCard({ category_id, name, onClose }) {
  const [error, setError] = useState("");

  async function deleteCategory() {
    setError("");
    const res = await fetch(`/api/admin/delete_category/${category_id}`, {
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
  return (
    <>
      <div>
        <CategoryCard category_id={category_id} name={name} url="admin_category" />
        <div className={c.adminButtonHolder}>
          <button className={c.adminButton} onClick={() => showDialog(AddCategoryForm, { name, category_id }, onClose)}>Редактировать</button>
          <button className={c.adminButton} onClick={deleteCategory}>Удалить</button>
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

