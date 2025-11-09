import React from "react";
import { categories } from "../../../data/data";
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
function Catalog() {
  return (
    <div>
      Catalog
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryCard
              category_id={category.id}
              name={category.name}
              url={"category"}
            ></CategoryCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Catalog;
