import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { categories } from "../../../data/data";
import AdminCategoryCard from "../components/AdminCategoryCard";
import { showDialog } from "../components/Dialog";
import { AddCategoryForm } from "../components/AddCategoryForm";
import { backend } from "../api-globals";
import "../css/categoryCard.css"
import { forAdminOnly } from "../components/ForAdminOnly";

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

  // function needRefresh() {
  //   load();
  // }
  return (
    <div>
      <p>Администрирование</p>
      <button onClick={() => showDialog(AddCategoryForm, undefined, needRefresh)}>Добавить категорию</button>
      <Link to="/bids">Заявки</Link>
      <div className="card-holder">
        {categories.map((category) => (
            <AdminCategoryCard
            key={category.category_id}
              category_id={category.category_id}
              name={category.category_name}
              url={"admin_category"}
              onClose={load}
            ></AdminCategoryCard>
        ))}
      </div>

    </div>
  );


}

export default forAdminOnly(Admin);
