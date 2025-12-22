import React from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
function CategoryCard({ category_id, name}) {
  return (
    <div >
      <Link to={`/category/${category_id}`}>
        <div className="category-card"> 
          <img  className="category-image" src={`${backend}/api/category/image/${category_id}`} alt="бассейн"  />
          <div className="category-name"> {name}</div>
        </div>
      </Link>
    </div>
  );
}

export default CategoryCard;
