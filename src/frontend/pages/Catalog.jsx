import React, { useEffect, useState } from "react";
import "../css/toast.css"
import {CategoryCard} from "../components/CategoryCard";
import { backend } from "../api-globals";
import "../css/categoryCard.css"

export function Catalog() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  async function load() {
    const res = await fetch(`${backend}/api/categories`);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    load();
  }, [])


  return (
    <>
      Каталог
      <div className="card-holder">
        {categories.map((category) => (
          <CategoryCard
            key={category.category_id}
            category_id={category.category_id}
            name={category.category_name}
          ></CategoryCard>
        ))}
      </div>
      {error && (
        <div className="toast-notification">
          <div className="toast-content">
            <span className="toast-message">{error}</span>
            <button onClick={() => setError("")} className="toast-close">×</button>
          </div>
          {/* Прогресс-бар для автоскрытия */}
          <div className="toast-progress"></div>
        </div>
      )}
    </>
  );


}


