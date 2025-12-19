import React, { useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { AddCategoryForm } from "./AddCategoryForm";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import "../css/categoryCard.css"

function AdminCategoryCard({ category_id, name, url, onClose }) {
  const [error, setError] = useState("");

  async function deleteCategory() {
    setError("");
    const response = await fetch(`${backend}/api/admin/delete_category/${category_id}`, {
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
    <div>
      {error}
      <CategoryCard category_id={category_id} name={name} url={url} />
      <div className="admin-button-holder">
        <button className="admin-item-button" onClick={() => showDialog(AddCategoryForm, { name, category_id }, onClose)}>Редактировать</button>
        <button className="admin-item-button" onClick={deleteCategory}>Удалить</button>
      </div>
    </div>
  );
}

export default AdminCategoryCard;
