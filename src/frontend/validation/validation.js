// utils/validation.js

// Схемы валидации
export const validationRules = {
  category: {
    category_name: {
      min: 2,
      max: 50,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-]+$/,
      patternError: "Только буквы, цифры, пробелы и дефисы",
      custom: [
        (value) =>
          /^[\s\-]/.test(value) && "Нельзя начинать с пробела или дефиса",
        (value) =>
          /[\s\-]$/.test(value) && "Нельзя заканчивать пробелом или дефисом",
        (value) =>
          /\s\s+/.test(value) &&
          "Нельзя использовать несколько пробелов подряд",
      ],
    },
  },

  product: {
    product_article: {
      min: 3,
      max: 50,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\-_]+$/, 
      patternError:
        "Только буквы, цифры, дефисы и подчеркивания (пробелы не допускаются)",
    },

    product_name: {
      min: 2,
      max: 200,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-\.,;:!?"'()]+$/,
      patternError: "Недопустимые символы",
      custom: [
        (value) =>
          /^[\s\-]/.test(value) && "Нельзя начинать с пробела или дефиса",
      ],
    },

    product_description: {
      max: 2000,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-\.,;:!?"'()\n\r]*$/,
      patternError: "Недопустимые символы",
    },
  },
};

// Функция валидации одного поля
export const validateField = (type, fieldName, value) => {//type - category или item
  const rules = validationRules[type]?.[fieldName];
  if (!rules) return [];

  const trimmed = value ? value.toString().trim() : "";
  const errors = [];

  // Проверка длины
  if (trimmed) {
    if (rules.min && trimmed.length < rules.min) {//если правило существует и длина без пробелов...
      errors.push(`Минимум ${rules.min} символа`);
    }
    if (rules.max && trimmed.length > rules.max) {
      errors.push(`Максимум ${rules.max} символов`);
    }
  }

  // Проверка паттерна
  if (trimmed && rules.pattern && !rules.pattern.test(value)) {//если есть значение, правило (паттерн) существует и значение не подходит под рег.в. 
    errors.push(rules.patternError);
  }

  // Кастомные правила
  if (trimmed && rules.custom) {
    for (const rule of rules.custom) {
      const error = rule(value);//вызов каждой функции-правила из списка(она вернет сообщение или null)
      if (error) {
        errors.push(error);
        break; 
      }
    }
  }

  return errors;
};

// Функция валидации всей формы
export const validateForm = (type, formData) => {
  const errors = {};
  const rules = validationRules[type];

  Object.keys(rules).forEach((fieldName) => {//итерация правил по названиям полей
    const fieldErrors = validateField(type, fieldName, formData[fieldName]);//formData значение этого поля из данных формы
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;//записываем ошибку в формате ключ-значение
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,//флаг валидности формы
    errors,
  };
};
