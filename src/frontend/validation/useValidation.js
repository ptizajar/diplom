// // hooks/useValidation.js
// import { useState } from 'react';
// import { validateField, validateForm } from './validation.js';

// export const useValidation = (type) => {
//   const [errors, setErrors] = useState({});

//   const checkField = (fieldName, value) => {
//     const fieldErrors = validateField(type, fieldName, value);
    
//     if (fieldErrors.length > 0) {
//       setErrors(prev => ({ ...prev, [fieldName]: fieldErrors }));
//       return false;
//     }
    
//     setErrors(prev => ({ ...prev, [fieldName]: [] }));
//     return true;
//   };

//   const checkForm = (formData) => {
//     const result = validateForm(type, formData);
//     setErrors(result.errors);
//     return result.isValid;
//   };

//   const clearErrors = () => setErrors({});

//   return {
//     errors,
//     checkField,
//     checkForm,
//     clearErrors
//   };
// };




// hooks/useValidation.js
import { useState } from 'react';
import { validateField, validateForm } from './validation.js';

export const useValidation = (type) => {
  const [errors, setErrors] = useState({});

  const checkField = (fieldName, value) => {
    const fieldErrors = validateField(type, fieldName, value);
    
    if (fieldErrors.length > 0) {
      setErrors(prev => ({ ...prev, [fieldName]: fieldErrors }));
      return false;
    }
    
    // Убираем поле из errors вместо установки пустого массива
    setErrors(prev => {
      if (!prev[fieldName]) return prev; // Если не было ошибок - не обновляем
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    return true;
  };

  const checkForm = (formData) => {
    const result = validateForm(type, formData);
    setErrors(result.errors);
    return result.isValid;
  };

  return {
    errors,
    checkField,
    checkForm
    // clearErrors убран - он не используется
  };
};