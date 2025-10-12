import React from "react";
import { useParams } from "react-router-dom";
import { items } from "../../../data/data";
function ItemPage() {
  const { itemId } = useParams();
  const item = items.find((i) => i.id === parseInt(itemId, 10));

  return (
    <div>
      {item.name}
      <br />
      {item.price}
      <br />
      {item.size}
      <br />
    </div>
  );
}

export default ItemPage;
