import React, { useEffect, useState } from "react";

import CategoryCard from "../components/CategoryCard";
import { backend } from "../api-globals";
import "../css/categoryCard.css"

function Catalog() {
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
      Каталог
      <div className="card-holder">
        {categories.map((category) => (
          <CategoryCard
            key={category.category_id}
            category_id={category.category_id}
            name={category.category_name}
            url={"category"}
          ></CategoryCard>
        ))}
      </div>

    </div>
  );


}

export default Catalog;
