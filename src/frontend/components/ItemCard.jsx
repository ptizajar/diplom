import React from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
function ItemCard({ item_id,item_name, price }) {
  return (
    <div >
      <Link to={`/item/${item_id}`}>
        <img src={`${backend}/api/item/image/${item_id}`} alt="бассейн" />
        <br />
        <p>{item_name}</p>
        <br />
        <p>{price}</p>
        <br />
      </Link>
    </div>
  );
}

export default ItemCard;
