import React from "react";
import { useState } from "react";
import ItemCard from "../components/ItemCard";
import { backend } from "../api-globals";
import { useEffect } from "react";
import "../css/home.css"
import "../css/itemCard.css"

function Home() {
  const [items, setItems] = useState([]);
  async function loadItems() {
    const res = await fetch(`${backend}/api/showed_items`, {credentials: "same-origin"});
    const data = await res.json();
    setItems(data);
  }
  useEffect(() => { loadItems() }, []);
  return (
    <div>
      <p>Главная</p>
      <div className="banner"><p> МАКС-МЕБЕЛЬ - лучшее решение для вашего офиса</p></div>
      <h1 className="title">Хиты продаж</h1>
      <div className="card-holder">
        {items.map(
          (item) =>
            !item.show && (
              <ItemCard
                key={item.item_id}
                item_id={item.item_id}
                name={item.item_name}
                price={item.price}
                url={"category"}
              ></ItemCard>
            )
        )}
      </div>
    </div>
  );
}

export default Home;
