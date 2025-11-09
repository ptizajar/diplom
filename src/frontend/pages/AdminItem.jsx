import React from "react"
import { useParams } from "react-router-dom";
import { items } from "../../../data/data";
function AdminItem() {
    const { item_id } = useParams();
    const item = items.find((i) => i.id === parseInt(item_id, 10));

    return (
        <div>
            {item.name}, {item.price}
            <button>Edit</button>
        </div>
    )
}

export default AdminItem
