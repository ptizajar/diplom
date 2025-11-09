import React from "react";
import { useParams } from "react-router-dom";
import { categories, items } from "../../../data/data";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
function Category() {
  const { category_id } = useParams();
  const thisCategory = categories.find(
    (category) => category.id === category_id
  );

  const categoryArray = items.filter(
    (item) => item.category_id === thisCategory.id
  );
  console.log(categoryArray);

  return (
    <div>
      {thisCategory.name}
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {categoryArray.map((item) => (
          <li key={item.id}>
            <ItemCard
              item_id={item.id}
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
