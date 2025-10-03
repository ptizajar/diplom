import React from "react";
import { Link } from "react-router-dom";
function CategoryCard({ categoryId, name }) {
  return (
    <div style={{border: "solid red 1px"}}>
      <Link to={`/category/${categoryId}`}>
        <img src={"../../public/pool.jpg"} alt="бассейн" /><br />
        <p>{name}</p><br />
      </Link>
    </div>
  );
}

export default CategoryCard;
