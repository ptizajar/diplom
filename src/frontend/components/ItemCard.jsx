import React from "react";
import { Link } from "react-router-dom";
function ItemCard({ itemId, name, size, price }) {
  return (
    <div >
      <Link to={`/item/${itemId}`}>
        <img src={"/public/pool.jpg"} alt="бассейн" />
        <br />
        <p>{name}</p>
        <br />
        <p>{size}</p>
        <br />
        <p>{price}</p>
        <br />
      </Link>
    </div>
  );
}

export default ItemCard;
