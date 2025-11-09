import React from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
function CategoryCard({ category_id, name, url }) {
  return (
    <div >
      <Link to={`/${url}/${category_id}`}>
        <img src={`${backend}/api/category/image/${category_id}`} alt="бассейн"  style={{height:"300px", width:"300px", objectFit:"contain"}}/>
        <br />
        <p>{name}</p>
        <br />
      </Link>
    </div>
  );
}

export default CategoryCard;
