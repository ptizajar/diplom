import React from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import c from "../css/.module/categoryCard.module.css"
export function CategoryCard({ category_id, name, url}) {
  return (
    <div >
      <Link to={`/${url}/${category_id}`}>
        <div className={c.card}> 
          <img  className={c.categoryImage} src={`${backend}/api/category/image/${category_id}`} alt="бассейн"  />
          <div className={c.categoryName}> {name}</div>
        </div>
      </Link>
    </div>
  );
}


