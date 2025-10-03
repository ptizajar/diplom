import React from "react";
import { Link } from "react-router-dom";
function AdminCategoryCard({ categoryId, name }) {
  return (
    <div style={{border: "solid red 1px"}}>
      <Link to={`/admin_category/${categoryId}`}>
        <img src={"../../public/pool.jpg"} alt="бассейн" /><br />
        <p>{name}</p><br />
        <button>Edit</button>
        <button>Delete</button>
      </Link>
    </div>
  );
}

export default AdminCategoryCard;
