import React from "react";
import { Link } from "react-router-dom";
import f from "../css/.module/footer.module.css"
export function Footer() {
  return (
    <div className={f.footer}>
      Футер
      <br></br>
      <a href="/public/consent.pdf" target="_blank" rel="noopener noreferrer" style={{color:"white"}}>
        Согласие на обработку ПДн
      </a>
      <br></br>
      <a href="/public/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" style={{color:"white"}}>
        Политика конфиденциальности
      </a>
      {/* <Link to={"/politics"}>
        <button>Политика конфиденциальности</button>
      </Link> */}
    </div>
  );
}


