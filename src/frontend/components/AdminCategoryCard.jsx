import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { AddCategoryForm } from "./AddCategoryForm";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import "../css/categoryCard.css"
function AdminCategoryCard({ category_id, name, url, onClose }) {

  async function deleteCategory() {
    await fetch(`${backend}/api/admin/delete_category/${category_id}`, {
      method: 'delete'
    });
    onClose();

  }
  return (
    <div>
      <CategoryCard category_id={category_id} name={name} url={url} />
      <div className="admin-button-holder">     
        <button className="admin-item-button" onClick={() => showDialog(AddCategoryForm, { name, category_id, onClose })}>Редактировать</button>
        <button className="admin-item-button" onClick={deleteCategory}>Удалить</button>
        </div>

    </div>
  );
}

export default AdminCategoryCard;
