import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/itemCard.css"


function Category() {
  const { category_id } = useParams();

  const [categoryName, setCategoryName] = useState(null);
  const [items, setItems] = useState([]);

  async function loadCategory() {
    const result = await fetch(`${backend}/api/category/${category_id}`);
    const data = await result.json();
    setCategoryName(data.category_name);
  }

  async function loadItems() {
    const res = await fetch(`${backend}/api/category/${category_id}/items`);
    const data = await res.json();
    setItems(data);
  }
  useEffect(() => { loadCategory() }, []);
  useEffect(() => { loadItems() }, []);


  return (
    <div>
      <p>{categoryName}</p>
      <div className="card-holder" >
        {items.map((item) => (

          <ItemCard
            key={item.item_id}
            item_id={item.item_id}
            item_name={item.item_name}
            price={item.price}
          ></ItemCard>

        ))}
      </div>
    </div>
  );
}

export default Category;
