import React from "react";
import { useState } from "react";
import ItemCard from "../components/ItemCard";
import { backend } from "../api-globals";
import { useEffect } from "react";

function Home() {
  const [items, setItems] = useState([]);
  async function loadItems() {
      const res = await fetch(`${backend}/api/showed_items`);
      const data = await res.json();
      setItems(data);
    }
    useEffect(() => { loadItems() }, []);
  return (
    <div>
      Home
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {items.map(
          (item) =>
            !item.show && (
              <li key={item.item_id}>
                <ItemCard
                  item_id={item.item_id}
                  name={item.item_name}
                  price={item.price}
                  url={"category"}
                ></ItemCard>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default Home;
