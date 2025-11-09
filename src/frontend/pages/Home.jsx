import React from "react";
import { items } from "../../../data/data";
import ItemCard from "../components/ItemCard";

function Home() {
  return (
    <div>
      Home
      <ul style={{ display: "flex", flexDirection: "column" }}>
        {items.map(
          (item) =>
            item.hit && (
              <li key={item.id}>
                <ItemCard
                  item_id={item.id}
                  name={item.name}
                  size={item.size}
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
