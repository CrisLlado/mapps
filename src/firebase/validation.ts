// validation.ts

// Función para validar el correo electrónico
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  if (!email) {
    return "El correo electrónico es requerido";
  }
  if (!emailRegex.test(email)) {
    return "Correo electrónico inválido";
  }

  return null;
};

// Función para validar la contraseña
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "La contraseña es requerida";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }

  return null;
};
