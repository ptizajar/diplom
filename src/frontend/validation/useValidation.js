
// import { useState } from 'react';
// import { validateField, validateForm } from './validation.js';

// export const useValidation = (type) => {
//   const [errors, setErrors] = useState({});

//   const checkField = (fieldName, value) => {//возвращает булево (валидно/не валидно)
//     const fieldErrors = validateField(type, fieldName, value);
//     if (fieldErrors.length > 0) {
//       setErrors(prev => ({ ...prev, [fieldName]: fieldErrors }));
//       return false;
//     }
    
//     setErrors(prev => {
//       if (!prev[fieldName]) return prev; // Если не было ошибок - не обновляем
//       const newErrors = { ...prev };
//       delete newErrors[fieldName];
//       return newErrors;//очистка ошибок
//     });
    
//     return true;
//   };

//   const checkForm = (formData) => {
//     const result = validateForm(type, formData);
//     setErrors(result.errors);
//     return result.isValid;
//   };

//   return {
//     errors,
//     checkField,
//     checkForm
//   };
// };




import { useState } from 'react';
import { validationRules } from './validation.js';

export const useValidation = (type) => {
  const [errors, setErrors] = useState({});
  
  // Вспомогательная функция валидации одного поля возвращает массив ошибок
  const validateField = (fieldName, value) => {
    const rules = validationRules[type]?.[fieldName];//поиск правила по названию поля и типа
    if (!rules) return [];
    
    const trimmed = value ? value.toString().trim() : "";
    const errors = [];
    
    // Проверка длины
    if (trimmed) {
      if (rules.min && trimmed.length < rules.min) {//если правило длины есть и...
        errors.push(`Минимум ${rules.min} символа`);
      }
      if (rules.max && trimmed.length > rules.max) {
        errors.push(`Максимум ${rules.max} символов`);
      }
    }
    
    // Проверка паттерна
    if (trimmed && rules.pattern && !rules.pattern.test(value)) {//если есть значение, паттерн и значение не валидно
      errors.push(rules.patternError);
    }
    
    // Кастомные правила
    if (trimmed && rules.custom) {
      for (const rule of rules.custom) {
        const error = rule(value);//возвращает строку или false
        if (error) {
          errors.push(error);
          break;
        }
      }
    }
    
    return errors;
  };
  

  // Вспомогательная функция валидации всей формы
  const validateForm = (formData) => {
    const errors = {};
    const rules = validationRules[type];
    
    Object.keys(rules).forEach((fieldName) => {//итерация по ключам правил и полям
      const fieldErrors = validateField(fieldName, formData[fieldName]);//formData[fieldName] - value
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  // Основной метод для проверки поля
  const checkField = (fieldName, value) => {
    const fieldErrors = validateField(fieldName, value);
    
    if (fieldErrors.length > 0) {
      setErrors(prev => ({ ...prev, [fieldName]: fieldErrors }));
      return false;
    }
    
    // Очищаем ошибку, если она была
    setErrors(prev => {
      if (!prev[fieldName]) return prev;
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    return true;
  };
  
  // Метод для проверки всей формы
  const checkForm = (formData) => {
    const result = validateForm(formData);
    setErrors(result.errors);
    return result.isValid;
  };
  
  // Опционально: метод для ручной очистки ошибок
  const clearErrors = () => setErrors({});
  
  return {
    errors,          // Текущие ошибки
    checkField,      // Проверить одно поле
    checkForm,       // Проверить всю форму
    clearErrors,     // Очистить все ошибки
    validateField,   // Экспортируем для использования вне компонента 
    validateForm,    // Экспортируем для использования вне компонента 
  };
};