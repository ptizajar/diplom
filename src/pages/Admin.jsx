import React from "react"
import { Link } from "react-router-dom"
import { categories } from "../../data/data"
import AdminCategoryCard from "../components/AdminCategoryCard"
function Admin() {
    return (
        <div>
            Admin
            <Link to="/bids">Заявки</Link>
            <ul style={{ display: "flex", flexDirection:"column" }}>
				{categories.map((category) => (
					<li key={category.id}>
					<AdminCategoryCard categoryId={category.id} name={category.name}></AdminCategoryCard>
					</li>
				))}
			</ul>
        </div>
    )
}

export default Admin
