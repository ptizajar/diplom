import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { AddCategoryForm } from "./AddCategoryForm";
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
function AdminCategoryCard({ categoryId, name, url }) {
  async function deleteCategory() {
    await fetch(`${backend}/api/admin/delete_category/${categoryId}`, {
      method: 'delete'
    })

  }
  return (
    <div>
      <CategoryCard categoryId={categoryId} name={name} url={url} />
      <button onClick={() => showDialog(AddCategoryForm, {name, categoryId})}>Edit</button>
      <button onClick={deleteCategory}>Delete</button>
    </div>
  );
}

export default AdminCategoryCard;
