import React from "react"
import { Link } from "react-router-dom"
function Header() {
    return (
        <div>Header
            <Link to={"/favourites"}>
				<button>Избранное</button>
			</Link>
             <Link to={"/catalog"}>
				<button>Каталог</button>
			</Link>
             <Link to={"/admin"}>
				<button>Админчик</button>
			</Link>
             
             <Link to={"/"}>
				<button>Главная</button>
			</Link></div>
    )
}

export default Header
