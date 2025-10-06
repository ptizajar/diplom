import React from "react";
import { useParams } from "react-router-dom";
import { categories, items } from "../../data/data";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
function Category() {
  const { categoryId } = useParams();
  const thisCategory = categories.find(
    (category) => category.id === categoryId
  );

  const categoryArray = items.filter(
    (item) => item.categoryId === thisCategory.id
  );
  console.log(categoryArray);

  return (
    <div>
      {thisCategory.name}
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categoryArray.map((item) => (
          <li key={item.id}>
            <ItemCard
              itemId={item.id}
              url={"item"}
              name={item.name}
              size={item.size}
              price={item.price}
            ></ItemCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
