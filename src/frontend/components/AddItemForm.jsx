import React, { useEffect, useState } from "react"

import "../api-globals"
import { backend } from "../api-globals";
import { useValidation } from "../validation/useValidation";

export function AddItemForm({ onCloseClick, param }) {
    const [itemName, setItemName] = useState(param?.name || "");
    const [isSubmitting, setIsSubmitting] = useState(false);//проверять находится ли форма в процессе отправки на сервер
    const { errors, checkField, checkForm } = useValidation('item');
    const [item, setItem] = useState(null);

    const handleFieldChange = (e, fieldType) => {
        checkField(fieldType, e.target.value);
    };

    async function loadItem() {
        const result = await fetch(`${backend}/api/item/${param.item_id}`);
        const data = await result.json();
        setItem(data)
    }

    useEffect(() => {
        if (param.item_id) {
            loadItem()
        }
    }, []);

    async function save(e) {
        e.preventDefault();
        const form = e.target; // ← форма, на которой сработал submit
        const formData = new FormData(form);

        // Извлекаем данные для валидации
        const validationData = {
            item_article: formData.get('article') || '',
            item_name: formData.get('item_name') || '',
            item_description: formData.get('description') || ''
        };

        // Проверяем форму с типом 'item'
        const isValid = checkForm(validationData);

        if (!isValid) {
            console.log('Ошибки валидации:', errors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${backend}/api/admin/item`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();
            onCloseClick();
        }
        catch {
            console.error("Ошибка сохранения:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const style = param ? { backgroundImage: `url('${backend}/api/item/image/${item?.item_id}')` } : {};

    return (
        <form className="form" onSubmit={save} id="addItemForm" method="POST" encType="multipart/form-data">
            {param.item_id ? "Редактировать товар" : "Добавить товар"}
            <input
                type="text"
                className="form-field"
                placeholder="Артикул"
                name="article"
                required
                defaultValue={item?.article}
                onChange={(e) => handleFieldChange(e, 'item_article')}
                onBlur={(e) => handleFieldChange(e, 'item_article')}
                disabled={isSubmitting} />
            {errors.item_article?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.item_article[0]}
                </div>
            )}
            <input
                type="text"
                className="form-field"
                placeholder="Название"
                name="item_name"
                required
                defaultValue={item?.item_name}
                onChange={(e) => handleFieldChange(e, 'item_name')}
                onBlur={(e) => handleFieldChange(e, 'item_name')}
                disabled={isSubmitting} />
            {errors.item_name?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.item_name[0]}
                </div>
            )}
            <input
                type="number"
                pattern="[0-9]*"
                className="form-field"
                placeholder="Длина"
                name="length"
                required
                defaultValue={item?.length}
                disabled={isSubmitting} />
            <input
                type="number"
                pattern="[0-9]*"
                className="form-field"
                placeholder="Ширина"
                name="width"
                required
                defaultValue={item?.width}
                disabled={isSubmitting} />
            <input
                type="number"
                pattern="[0-9]*"
                className="form-field"
                placeholder="Высота"
                name="height"
                required
                defaultValue={item?.height}
                disabled={isSubmitting} />
            <input
                type="number"
                pattern="[0-9]*"
                className="form-field"
                placeholder="Заказ от"
                name="quantity"
                required
                defaultValue={item?.quantity}
                disabled={isSubmitting} />
            <input
                type="number"
                pattern="[0-9]*"
                className="form-field"
                placeholder="Цена"
                name="price"
                required
                defaultValue={item?.price}
                disabled={isSubmitting} />
            <textarea
                type="text"
                className="form-field"
                placeholder="Описание"
                name="description"
                defaultValue={item?.description}
                onChange={(e) => handleFieldChange(e, 'item_description')}
                onBlur={(e) => handleFieldChange(e, 'item_description')}
                disabled={isSubmitting} />
            {errors.item_description?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.item_description[0]}
                </div>
            )}
            <div className="form-image" style={style}>
                <input type="file" placeholder="Загрузите изображение" name="item_image" accept="image/png, image/jpeg" required={!param} />
            </div>
            <div className="form-checkbox">
                <label htmlFor="check1">Отображать на главной</label>
                <input id="check1" type="checkbox" name="show" defaultChecked={item?.show}></input>
            </div>

            <input type="hidden" name="item_id" value={param.item_id} />
            <input type="hidden" name="category_id" value={param.category_id} />

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
