import React from "react"
import "./addCategoryForm.css"

export function AddCategoryForm() {
    return (
        <div className="form">
            Добавить категорию
            <input type="text" id="form-name" className="form-name" placeholder="Название"/>
            <input type="image" id="form-image" className="form-image" placeholder="Загрузите изображение"/>
        </div>
    )
}
