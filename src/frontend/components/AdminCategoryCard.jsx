import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { AddCategoryForm } from "./AddCategoryForm";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
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
      <button onClick={() => showDialog(AddCategoryForm, { name, category_id, onClose })}>Edit</button>
      <button onClick={deleteCategory}>Delete</button>
    </div>
  );
}

export default AdminCategoryCard;
