import React from "react"
import "./addCategoryForm.css"
import "../api-globals"


export function EditCategoryForm({onCloseClick}) {
    

    return (
        <form className="form"  id="editCategoryForm">
            Редактировать категорию
            <input type="text"  className="form-name" placeholder="Название" name="category_name" />
            <input type="file" className="form-image" placeholder="Загрузите изображение"/>

            <div className='button-holder'>
                <button className='form-button' type="submit">ОК</button>
                <button className='form-button' onClick={onCloseClick}>Отмена</button>
            </div>
        </form>
    )
}
