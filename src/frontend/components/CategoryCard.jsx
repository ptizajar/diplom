import React from "react";
import { Link } from "react-router-dom";
function CategoryCard({ categoryId, name, url }) {
  return (
    <div >
      <Link to={`/${url}/${categoryId}`}>
        <img src={"../../public/pool.jpg"} alt="бассейн" />
        <br />
        <p>{name}</p>
        <br />
      </Link>
    </div>
  );
}

export default CategoryCard;
