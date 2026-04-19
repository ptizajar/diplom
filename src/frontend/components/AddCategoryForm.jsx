import f from "../css/.module/form.module.css"
import "../api-globals"
import { backend } from "../api-globals";
import { useState, useEffect } from "react";
import { useValidation } from "../validation/useValidation";
import "../css/toast.css"
import React from "react";


export function AddCategoryForm({ onCloseClick, param }) {//получает из Dialog
    const [isSubmitting, setIsSubmitting] = useState(false);//проверять находится ли форма в процессе отправки на сервер
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);
    const { errors, checkField, checkForm, clearErrors } = useValidation('category');

   // Очистка памяти от временной ссылки при размонтировании
    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Создаем временную ссылку на выбранный файл
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    async function save(e) {//on submit
        e.preventDefault();
        setError("");
        const formData = new FormData(e.target);
        const categoryName = formData.get('category_name') || '';
        const isValid = checkForm({ category_name: categoryName });

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        const res = await fetch(`${backend}/api/admin/category`, {
            method: 'PUT',
            body: formData
        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            setIsSubmitting(false)
            return;
        }

        await res.json();

        clearErrors();
        onCloseClick();
    }
// Определяем, какую картинку показывать: новую выбранную, старую из БД или ничего
    const getBackgroundImage = () => {
        if (preview) return `url('${preview}')`;
        if (param?.category_id) return `url('${backend}/api/category/image/${param.category_id}')`;
        return 'none';
    };
    const style = { backgroundImage: getBackgroundImage() };
    // const style = param ? { backgroundImage: `url('${backend}/api/category/image/${param?.category_id}')` } : {};
    return (
        <>
            <form className={f.form} onSubmit={save} id="addCategoryForm" method="PUT" encType="multipart/form-data">
                <p className={f.title}>{param ? "Редактировать категорию" : "Добавить категорию"}</p>
                <div className={f.inputHolder}>
                    <label className={f.label}>Название</label>
                    <input
                        type="text"
                        className={f.field}
                        name="category_name"
                        required
                        defaultValue={param?.name}
                        onChange={(e) => checkField('category_name', e.target.value)}
                        onBlur={(e) => checkField('category_name', e.target.value)}//потеря фокуса
                        disabled={isSubmitting} />
                </div>
                {errors.category_name?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.category_name[0]}
                    </div>
                )}
                <div className={f.inputHolder}>
                    <label className={f.label}>Изображение</label>
                    <div className={f.image} style={style}>
                        <input
                            className={f.fileInput}
                            type="file"
                            name="category_image"
                            accept="image/png, image/jpeg"
                            required={!param}
                            onChange={handleImageChange} />
                    </div>
                </div>
        
                <input type="hidden" name="category_id" value={param?.category_id} />

                <div className={f.buttonHolder}>
                    <button
                        className={f.button}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        ОК
                    </button>
                    <button
                        className={f.button}
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
            {error && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-message">{error}</span>
                        <button onClick={() => setError("")} className="toast-close">×</button>
                    </div>
                    {/* Прогресс-бар для автоскрытия */}
                    <div className="toast-progress"></div>
                </div>
            )}
        </>
    )
}
