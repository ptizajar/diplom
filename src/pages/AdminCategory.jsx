import React from "react";
import { useParams } from "react-router-dom";
import { categories } from "../../data/data";
import { items } from "../../data/data";
import AdminItemCard from "../components/AdminItemCard";
import { Link } from "react-router-dom";

function AdminCategory() {
  const { categoryId } = useParams();
  const thisCategory = categories.find(
    (category) => category.id === categoryId
  );

  const categoryArray = items.filter(
    (item) => item.categoryId === thisCategory.id
  );
  return (
    <div>
      {thisCategory.name}
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categoryArray.map((item) => (
          <li key={item.id}>
            <AdminItemCard
              itemId={item.id}
              name={item.name}
              size={item.size}
              price={item.price}
            ></AdminItemCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCategory;
