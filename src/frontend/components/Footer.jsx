import React from "react";
import { Link } from "react-router-dom";
import f from "../css/.module/footer.module.css"
export function Footer() {
  return (
    <div className={f.footer}>
      Футер
      <Link to={"/politics"}>
        <button>Политика конфиденциальности</button>
      </Link>
    </div>
  );
}


