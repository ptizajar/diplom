import "../css/form.css"
import "../api-globals"
import { backend } from "../api-globals";
import { useState } from "react";
import { useValidation } from "../validation/useValidation";
import React from "react";


export function AddCategoryForm({ onCloseClick, param }) {//получает из Dialog
    const [isSubmitting, setIsSubmitting] = useState(false);//проверять находится ли форма в процессе отправки на сервер
    const [error, setError] = useState("");
    const { errors, checkField, checkForm, clearErrors } = useValidation('category');

    const handleFieldChange = (e) => {
        checkField('category', e.target.value);
    };

    async function save(e) {//on submit
        e.preventDefault();
        const formData = new FormData(e.target);
        const categoryName = formData.get('category_name') || '';
        const isValid = checkForm({ category_name: categoryName });

        if (!isValid) {
            return; 
        }

        setIsSubmitting(true);

        const response = await fetch(`${backend}/api/admin/category`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            setError(err.error);
            setIsSubmitting(false)
            return;
        }

        await response.json();
        clearErrors();
        onCloseClick();
    }

    const style = param ? { backgroundImage: `url('${backend}/api/category/image/${param?.category_id}')` } : {};
    return (
        <form className="form" onSubmit={save} id="addCategoryForm" method="POST" encType="multipart/form-data">
            {param ? "Редактировать категорию" : "Добавить категорию"}
            <input
                type="text"
                className="form-field"
                placeholder="Название"
                name="category_name"
                required
                defaultValue={param?.name}
                onChange={handleFieldChange}
                onBlur={(e) => checkField('category_name', e.target.value)}//потеря фокуса
                disabled={isSubmitting} />
            {errors.category_name?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.category_name[0]}
                </div>
            )}
            <div className="form-image" style={style}>
                <input
                    type="file"
                    placeholder="Загрузите изображение"
                    name="category_image"
                    accept="image/png, image/jpeg"
                    required={!param} />
            </div>
            <input type="hidden" name="category_id" value={param?.category_id} />

            <div className='button-holder'>
                <button
                    className='form-button'
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Сохранение...' : 'ОК'}
                </button>
                <button
                    className='form-button'
                    onClick={() => {
                        clearErrors();
                        onCloseClick()
                    }}
                    disabled={isSubmitting}
                >
                    Отмена
                </button>
            </div>
        </form>
    )
}
