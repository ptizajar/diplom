import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { categories } from "../../../data/data";
import AdminCategoryCard from "../components/AdminCategoryCard";
import { showDialog } from "../components/Dialog";
import { AddCategoryForm } from "../components/AddCategoryForm";
import { backend } from "../api-globals";

function Admin() {
  const [categories, setCategories] = useState([]);
  async function load() {
    const res = await fetch(`${backend}/api/categories`);
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    load();
  }, [])
  return (
    <div>
      Admin
      <button onClick={() => showDialog(AddCategoryForm)}>Add new</button>
      <Link to="/bids">Заявки</Link>
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categories.map((category) => (
          <li key={category.category_id}>
            <AdminCategoryCard
              categoryId={category.category_id}
              name={category.category_name}
              url={"admin_category"}
            ></AdminCategoryCard>
          </li>
        ))}
      </ul>

    </div>
  );


}

export default Admin;
