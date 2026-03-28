import React, { useEffect, useState } from "react"
import f from "../css/.module/form.module.css"
import "../api-globals"
import { backend } from "../api-globals";
import { useValidation } from "../validation/useValidation";
import "../css/toast.css"

export function AddItemForm({ onCloseClick, param }) {//получает из Dialog
    const [isSubmitting, setIsSubmitting] = useState(false);//проверять находится ли форма в процессе отправки на сервер
    const [error, setError] = useState("");
    const { errors, checkField, checkForm, clearErrors } = useValidation('item');
    const [item, setItem] = useState(null);
    const [preview, setPreview] = useState(null);

    // const handleFieldChange = (e, fieldType) => {
    //     checkField(fieldType, e.target.value);
    // };
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

    async function loadItem() {
        const res = await fetch(`${backend}/api/item/${param.item_id}`);
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            setIsSubmitting(false)
            return;
        }
        const data = await res.json();
        setError("");
        setItem(data)
    }

    useEffect(() => {
        if (param.item_id) {
            loadItem()
        }
    }, []);

    async function save(e) {
        e.preventDefault();
        setError("");
        const formData = new FormData(e.target);

        const validationData = {
            item_article: formData.get('article') || '',
            item_name: formData.get('item_name') || '',
            item_description: formData.get('description') || ''
        };

        const isValid = checkForm(validationData);

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        const res = await fetch(`${backend}/api/admin/item`, {
            method: 'PUT',
            body: formData
        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
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
        if (param?.item_id) return `url('${backend}/api/item/image/${param.item_id}')`;
        return 'none';
    };
    // const style = param ? { backgroundImage: `url('${backend}/api/item/image/${item?.item_id}')` } : {};
    const style = { backgroundImage: getBackgroundImage() };

    return (
        <>
            <form className={f.form} style={{ width: "500px" }} onSubmit={save} id="addItemForm" method="PUT" encType="multipart/form-data">
                <p className={f.title}>{param.item_id ? "Редактировать товар" : "Добавить товар"}</p>
                <div className={f.twoColumns}>
                    <div className={f.column}>
                        <div className={f.inputHolder} style={{ marginTop: "0" }}>
                            <label className={f.label} >Артикул</label>
                            <input
                                type="text"
                                className={f.field}
                                placeholder="Артикул"
                                name="article"
                                required
                                defaultValue={item?.article}
                                onChange={(e) => checkField('item_article', e.target.value)}
                                onBlur={(e) => checkField('item_article', e.target.value)}
                                disabled={isSubmitting} />
                        </div>
                        {errors.item_article?.length > 0 && (
                            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                {errors.item_article[0]}

                            </div>
                        )}
                        <div className={f.inputHolder}>
                            <label className={f.label}>Название</label>
                            <input
                                type="text"
                                className={f.field}
                                placeholder="Название"
                                name="item_name"
                                required
                                defaultValue={item?.item_name}
                                onChange={(e) => checkField('item_name', e.target.value)}
                                onBlur={(e) => checkField('item_name', e.target.value)}
                                disabled={isSubmitting} />
                        </div>
                        {errors.item_name?.length > 0 && (
                            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                {errors.item_name[0]}

                            </div>
                        )}
                        <div className={f.inputHolder}>
                            <label className={f.label}>Длина</label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                className={f.field}
                                placeholder="Длина"
                                name="length"
                                required
                                defaultValue={item?.length}
                                disabled={isSubmitting} />
                        </div>
                        <div className={f.inputHolder}>
                            <label className={f.label}>Ширина</label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                className={f.field}
                                placeholder="Ширина"
                                name="width"
                                required
                                defaultValue={item?.width}
                                disabled={isSubmitting} />
                        </div>
                        <div className={f.imageHolder}>
                            <label className={f.label}>Изображение</label>
                            <div className={f.image} style={style}>
                                <input
                                    className={f.fileInput}
                                    type="file"
                                    placeholder="Загрузите изображение"
                                    name="item_image"
                                    accept="image/png, image/jpeg"
                                    required={!param}
                                    onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>
                    <div className={f.column}>
                        <div className={f.inputHolder} style={{ marginTop: "0" }}>
                            <label className={f.label}>Высота</label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                className={f.field}
                                placeholder="Высота"
                                name="height"
                                required
                                defaultValue={item?.height}
                                disabled={isSubmitting} />
                        </div>
                        <div className={f.inputHolder}>
                            <label className={f.label}>Заказ от</label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                className={f.field}
                                placeholder="Заказ от"
                                name="quantity"
                                required
                                defaultValue={item?.quantity}
                                disabled={isSubmitting} />
                        </div>
                        <div className={f.inputHolder}>
                            <label className={f.label}>Цена</label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                className={f.field}
                                placeholder="Цена"
                                name="price"
                                required
                                defaultValue={item?.price}
                                disabled={isSubmitting} />
                        </div>


                        <div className={f.inputHolder}>
                            <label className={f.label}>Описание</label>
                            <textarea
                                type="text"
                                className={f.field}
                                placeholder="Описание"
                                name="description"
                                defaultValue={item?.description}
                                onChange={(e) => checkField('item_description', e.target.value)}
                                onBlur={(e) => checkField('item_description', e.target.value)}
                                disabled={isSubmitting} />
                        </div>
                        {errors.item_description?.length > 0 && (
                            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                                {errors.item_description[0]}
                            </div>
                        )}


                        <div className={f.checkboxInGrid}>
                            <label className={f.label} htmlFor="checkbox">Хит продаж</label>
                            <input
                                id="checkbox"
                                type="checkbox"
                                name="show"
                                defaultChecked={item?.show}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className={f.checkboxHolder}>
                    <label className={f.label} htmlFor="checkbox">Отображать на главной</label>
                    <input
                        id="checkbox"
                        type="checkbox"
                        name="show"
                        defaultChecked={item?.show}
                        disabled={isSubmitting}>
                    </input>
                </div> */}

                <input type="hidden" name="item_id" value={param.item_id} />
                <input type="hidden" name="category_id" value={param.category_id} />

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
            </form >
            {error && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-message">{error}</span>
                        <button onClick={() => setError("")} className="toast-close">×</button>
                    </div>
                    {/* Прогресс-бар для автоскрытия */}
                    <div className="toast-progress"></div>
                </div>
            )
            }</>
    );
}
