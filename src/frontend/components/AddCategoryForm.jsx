import React from "react"
import "./addCategoryForm.css"
import "../api-globals"
import { backend } from "../api-globals";

export function AddCategoryForm({ onCloseClick, param }) {
    async function save(e) {
        e.preventDefault();
        const response = await fetch(`${backend}/api/admin/category`, {
            method: 'PUT',
            body: new FormData(addCategoryForm)
        });

        const result = await response.json();
        console.log(result);
        onCloseClick();
    }
    const style = param ? { backgroundImage: `url('${backend}/api/category/image/${param?.category_id}')` } : {};
    return (
        <form className="form" onSubmit={save} id="addCategoryForm" method="POST" encType="multipart/form-data">
            {param ? "Редактировать категорию" : "Добавить категорию"}
            <input type="text" className="form-field" placeholder="Название" name="category_name" required defaultValue={param?.name} />
            <div className="form-image" style={style}>
                <input type="file" placeholder="Загрузите изображение" name="category_image" accept="image/png, image/jpeg" required={!param} />
            </div>
            <input type="hidden" name="category_id" value={param?.category_id} />

            <div className='button-holder'>
                <button className='form-button' type="submit">ОК</button>
                <button className='form-button' onClick={onCloseClick}>Отмена</button>
            </div>
        </form>
    )
}
