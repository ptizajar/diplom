import React from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
function CategoryCard({ categoryId, name, url }) {
  return (
    <div >
      <Link to={`/${url}/${categoryId}`}>
        <img  src={`${backend}/api/category/image/${categoryId}`} alt="бассейн" />
        <br />
        <p>{name}</p>
        <br />
      </Link>
    </div>
  );
}

export default CategoryCard;
