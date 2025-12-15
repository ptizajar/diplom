// Схемы валидации
export const validationRules = {
  category: {
    category_name: {
      min: 2,
      max: 50,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-]+$/,
      patternError: "Только буквы, цифры, пробелы и дефисы",
      custom: [
        (value) => {
          if (value.startsWith("-") || value.startsWith(" ")) {
            return "Нельзя начинать с пробела или дефиса";
          }
          return null;
        },
        (value) => {
          if (value.endsWith("-") || value.endsWith(" ")) {
            return "Нельзя заканчивать пробелом или дефисом";
          }
          return null;
        },
        (value) => {
          if (/\s\s+/.test(value)) {
            return "Нельзя использовать несколько пробелов подряд";
          }
          return null;
        },
      ],
    },
  },

  item: {
    item_article: {
      min: 3,
      max: 50,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\-_]+$/,
      patternError:
        "Только буквы, цифры, дефисы и подчеркивания (пробелы не допускаются)",
      custom: [
        (value) => {
          if (value.startsWith("-")) {
            return "Нельзя начинать с дефиса";
          }
          return null;
        },
        (value) => {
          if (value.endsWith("-")) {
            return "Нельзя заканчивать дефисом";
          }
          return null;
        },
      ],
    },

    item_name: {
      min: 2,
      max: 200,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-\.,;:!?"'()]+$/,
      patternError: "Недопустимые символы",
      custom: [
        (value) => {
          if (value.startsWith("-") || value.startsWith(" ")) {
            return "Нельзя начинать с пробела или дефиса";
          }
          return null;
        },
        (value) => {
          if (value.endsWith("-") || value.endsWith(" ")) {
            return "Нельзя заканчивать пробелом или дефисом";
          }
          return null;
        },
        (value) => {
          if (/\s\s+/.test(value)) {
            return "Нельзя использовать несколько пробелов подряд";
          }
          return null;
        },
      ],
    },

    item_description: {
      max: 2000,
      pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-\.,;:!?"'()\n\r]*$/,
      patternError: "Недопустимые символы",
    },
  },

  registration: {
    login: {
      min: 3,
      max: 50,
      pattern: /^[a-zA-Z0-9_.@]+$/,
      patternError: "Только латиница, цифры, символы _ @ .",
      custom: [
        (value) => {
          if (/\s/.test(value)) return "Нельзя использовать пробелы";
          return null;
        },
      ],
    },

    user_name: {
      min: 2,
      max: 50,
      pattern: /^[а-яА-ЯёЁ\s\-]+$/,
      patternError: "Только кириллица, пробелы и дефисы",
      custom: [
        (value) => {
          if (value.startsWith("-") || value.startsWith(" "))
            return "Нельзя начинать с пробела или дефиса";
          return null;
        },
        (value) => {
          if (value.endsWith("-") || value.endsWith(" "))
            return "Нельзя заканчивать пробелом или дефисом";
          return null;
        },
        (value) => {
          if (/\s\s+/.test(value))
            return "Нельзя использовать несколько пробелов подряд";
          return null;
        },
      ],
    },

    phone: {
      pattern: /^[+\s\-\(\)0-9]+$/,
      patternError:
        "Номер может содержать только цифры, пробелы, скобки, дефисы и знак +",
      custom: [
        (value) => {
          if (!/^(\+7|8)/.test(value)) {
            return "Номер должен начинаться с +7 или 8";
          }
          return null;
        },
        (value) => {
          // Проверяем количество цифр
          const digitsOnly = value.replace(/\D/g, "");
          if (digitsOnly.length !== 11) {
            return "Номер должен содержать 11 цифр";
          }
          return null;
        },
      ],
    },

    password: {
      min: 6,
      max: 50,
      pattern: /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/,
      patternError:
        "Пароль может содержать только латиницу, цифры и специальные символы",
      custom: [
        (value) => {
          if (!/[A-Z]/.test(value))
            return "Должна быть хотя бы одна заглавная буква";
          return null;
        },
        (value) => {
          if (!/[0-9]/.test(value)) 
            return "Должна быть хотя бы одна цифра";
          return null;
        },
        (value) => {
          if (!/[\W_]/.test(value))
            return "Должен быть хотя бы один специальный символ";
          return null;
        },
      ],
    },
  },
};

// // Функция валидации одного поля. Возвращает список ошибок
// export const validateField = (type, fieldName, value) => {//type - category или item
//   const rules = validationRules[type]?.[fieldName];//поиск правил по названию и типу поля
//   if (!rules) return [];

//   const trimmed = value ? value.toString().trim() : "";
//   const errors = [];

//   // Проверка длины
//   if (trimmed) {
//     if (rules.min && trimmed.length < rules.min) {//если правило существует и длина без пробелов...
//       errors.push(`Минимум ${rules.min} символа`);
//     }
//     if (rules.max && trimmed.length > rules.max) {
//       errors.push(`Максимум ${rules.max} символов`);
//     }
//   }

//   // Проверка паттерна
//   if (trimmed && rules.pattern && !rules.pattern.test(value)) {//если есть значение, правило (паттерн) существует и значение не подходит
//     errors.push(rules.patternError);
//   }

//   // Кастомные правила
//   if (trimmed && rules.custom) {//если есть значения и особое правило
//     for (const rule of rules.custom) {
//       const error = rule(value);//вызов каждой функции-правила из списка(она вернет сообщение или null)
//       if (error) {
//         errors.push(error);
//         break;
//       }
//     }
//   }

//   return errors;
// };

// // Функция валидации всей формы. Возвращает объект: валидность формы и объект ошибок
// export const validateForm = (type, formData) => {
//   const errors = {};
//   const rules = validationRules[type];

//   Object.keys(rules).forEach((fieldName) => {//итерация правил по названиям полей
//     const fieldErrors = validateField(type, fieldName, formData[fieldName]);
//     if (fieldErrors.length > 0) {
//       errors[fieldName] = fieldErrors;//записываем ошибку в формате ключ-значение
//     }
//   });

//   return {
//     isValid: Object.keys(errors).length === 0,//флаг валидности формы
//     errors,
//   };
// };
