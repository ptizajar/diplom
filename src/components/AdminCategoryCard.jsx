import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
function AdminCategoryCard({ categoryId, name, url }) {
  return (
    <div>
      <CategoryCard categoryId={categoryId} name={name} url={url} />
      <button>Edit</button>
      <button>Delete</button>
    </div>
  );
}

export default AdminCategoryCard;
