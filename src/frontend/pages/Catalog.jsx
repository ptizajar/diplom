import React, { useEffect, useState } from "react";

import CategoryCard from "../components/CategoryCard";
import { backend } from "../api-globals";

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
      Catalog
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categories.map((category) => (
          <li key={category.category_id}>
            <CategoryCard
              category_id={category.category_id}
              name={category.category_name}
              url={"category"}
            ></CategoryCard>
          </li>
        ))}
      </ul>

    </div>
  );


}

export default Catalog;
