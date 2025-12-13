import React from "react"
import "../css/form.css"
import "../api-globals"
import { backend } from "../api-globals";
import { useState } from "react";
import { useValidation } from "../validation/useValidation";


export function AddCategoryForm({ onCloseClick, param }) {
    const [categoryName, setCategoryName] = useState(param?.name || "");
    // const [validationError, setValidationError] = useState("");
    const [error, setError] = useState({}); 
    const [isSubmitting, setIsSubmitting] = useState(false);//проверять находится ли форма в процессе отправки на сервер
    const { errors, checkField, checkForm, clearErrors } = useValidation('category');
    

    // Проверка перед отправкой
     const validateBeforeSubmit = () => {
        // Синхронная проверка
        const fieldErrors = validateField('category', 'category_name', categoryName);
        
        // НЕМЕДЛЕННО обновляем errors
        if (fieldErrors.length > 0) {
            setError({ category_name: fieldErrors });
            return false;
        }
        
        setError({}); // Очищаем
        return true;
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        setCategoryName(value);
        // Проверяем поле в реальном времени
        checkField('category_name', value);
    };
    async function save(e) {

        e.preventDefault();
         const isValid = checkForm({ category_name: categoryName });
        
        if (!isValid) {
            return; // Останавливаем если есть ошибки
        }
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`${backend}/api/admin/category`, {
                method: 'PUT',
                body: new FormData(addCategoryForm)
            });

            const result = await response.json();
            console.log(result);
            onCloseClick();
        }
        catch {
            console.error("Ошибка сохранения:", error);
        } finally {
            setIsSubmitting(false);
        }
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
                onChange={handleInputChange}
                onBlur={(e) => checkField('category_name', e.target.value)}
                disabled={isSubmitting} />
             {errors.category_name && errors.category_name.length > 0 && (
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
                    onClick={onCloseClick}
                    disabled={isSubmitting}
                >
                    Отмена
                </button>
            </div>
        </form>
    )
}
