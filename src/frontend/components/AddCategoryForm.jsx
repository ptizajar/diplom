import React from "react"
import "./addCategoryForm.css"
import "../api-globals"
import { backend } from "../api-globals";

export function AddCategoryForm({onCloseClick}) {
    async function save(e){
        e.preventDefault();
        const response = await fetch(`${backend}/api/admin/category`, {
      method: 'PUT',
      body: new FormData(addCategoryForm)
    });

    const result = await response.json();
    console.log(result);
    }
    return (
        <form className="form" onSubmit={save} id="addCategoryForm">
            Добавить категорию
            <input type="text"  className="form-name" placeholder="Название" name="category_name" />
            <input type="file" className="form-image" placeholder="Загрузите изображение"/>

            <div className='button-holder'>
                <button className='form-button' type="submit">ОК</button>
                <button className='form-button' onClick={onCloseClick}>ОТМЕНА</button>
			</div>
        </form>
    )
}
