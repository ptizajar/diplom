// Схемы валидации
export const validationRules = {
  category: {
    category_name: {
      required: true,
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
      required: true,
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
      required: true,
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
    required: true,
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
      required: true,
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

    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      patternError: "Введите корректный email адрес",
      custom: [
        (value) => {
          if (value.includes(".."))
            return "Email не может содержать две точки подряд";
          return null;
        },
        (value) => {
          const localPart = value.split("@")[0];
          if (
            localPart &&
            (localPart.startsWith(".") || localPart.endsWith("."))
          ) {
            return "Локальная часть email не может начинаться или заканчиваться точкой";
          }
          return null;
        },
      ],
    },

    password: {
      required: true,
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
          if (!/[0-9]/.test(value)) return "Должна быть хотя бы одна цифра";
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

  order: {
    user_name: {
      required: true,
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
      required: true,
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
          const digitsOnly = value.replace(/\D/g, "");
          if (digitsOnly.length !== 11) {
            return "Номер должен содержать 11 цифр";
          }
          return null;
        },
      ],
    },

    preferred_datetime: {
      required: true,
      custom: [
        (value) => {
          if (!value) return "Пожалуйста, выберите дату и время";
          return null;
        },
        (value) => {
          const selected = new Date(value);
          const now = new Date();
          const minDate = new Date(now);
          minDate.setMinutes(minDate.getMinutes() + 30);

          if (selected < minDate) {
            const minTime = minDate.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const minDateStr = minDate.toLocaleDateString("ru-RU");
            return `Пожалуйста, выберите время не ранее ${minTime} ${minDateStr}`;
          }
          return null;
        },
        (value) => {
          const selected = new Date(value);
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 14);
          maxDate.setHours(16, 59, 0, 0);

          if (selected > maxDate) {
            const maxTime = maxDate.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const maxDateStr = maxDate.toLocaleDateString("ru-RU");
            return `Пожалуйста, выберите время не позднее ${maxTime} ${maxDateStr}`;
          }
          return null;
        },
        (value) => {
          const selected = new Date(value);
          const hours = selected.getHours();

          if (hours < 10 || hours >= 17) {
            return "Пожалуйста, выберите время с 10:00 до 17:00";
          }
          return null;
        },
      ],
    },
  },
};
