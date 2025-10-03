import React from "react"
import { Link } from "react-router-dom"
function Footer() {
    return (
        <div>
            Footer
             <Link to={"/politics"}>
				<button>Политика конфиденциальности</button>
			</Link>
        </div>
    )
}

export default Footer
