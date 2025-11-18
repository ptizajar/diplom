import React from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/home.css"
function ItemCard({ item_id, item_name, price }) {
  return (
    <Link className="item-card" to={`/item/${item_id}`}>
      <div className="item-image-holder" style={{backgroundImage: `url(${backend}/api/item/image/${item_id})`}}>
        {/* <img className="item-image" src={`${backend}/api/item/image/${item_id}`} alt="товар" /> */}
        <button className="heart-icon"><img src="/public/favourites.svg" alt="в избранное" /></button>
      </div>
      <p className="item-name">{item_name}</p>
      <p className="item-price">{price} ₽</p>
    </Link>
  );
}

export default ItemCard;
