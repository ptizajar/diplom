import React from "react";
import { Link } from "react-router-dom";
export function Footer() {
  return (
    <div>
      Footer
      <Link to={"/politics"}>
        <button>Политика конфиденциальности</button>
      </Link>
    </div>
  );
}


