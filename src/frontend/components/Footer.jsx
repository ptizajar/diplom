import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
export function Footer() {
  return (
    <div className="footer">
      Футер
      <Link to={"/politics"}>
        <button>Политика конфиденциальности</button>
      </Link>
    </div>
  );
}


