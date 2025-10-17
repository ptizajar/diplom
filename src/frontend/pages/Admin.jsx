import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../../../data/data";
import AdminCategoryCard from "../components/AdminCategoryCard";
import { showDialog } from "../components/Dialog";
import { AddCategoryForm } from "../components/AddCategoryForm";
function Admin() {
  return (
    <div>
      Admin
          <button onClick={()=>showDialog(AddCategoryForm) }>Add new</button>
      <Link to="/bids">Заявки</Link>
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categories.map((category) => (
          <li key={category.id}>
            <AdminCategoryCard
              categoryId={category.id}
              name={category.name}
              url={"admin_category"}
            ></AdminCategoryCard>
          </li>
        ))}
      </ul>
  
    </div>
  );


}

export default Admin;
