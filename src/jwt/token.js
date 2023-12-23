import jwt from 'jsonwebtoken';

export function generateAndSetToken(res, email, password) {
  const token = jwt.sign({ email, password, role: "user" }, "Secret-key", { expiresIn: "24h" });
  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  return token
}
export function getEmailFromTokenLogin(token) {
  try {
    const decoded = jwt.verify(token, 'Secret-key');
    return decoded.email;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null; //  lanza una excepción según tus necesidades
  }
}

export function generateAndSetTokenEmail(email) {
  const token = jwt.sign({ email }, 'secreto', { expiresIn: '1h' });
  return token
}
export function getEmailFromToken(token) {
  try {
    const decoded = jwt.verify(token, 'secreto');
    const email = decoded.email;
    return email;
  } catch (error) {
    // Manejar errores de decodificación o token no válido
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

export function validateTokenResetPass(token) {
  try {
    const result = jwt.verify(token, 'secreto');
    return result;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('El token ha expirado');
      return null; // manejar el vencimiento de alguna otra manera
    } else {
      console.error('Error al verificar el token:', error);
      return null; //manejar otros errores de alguna otra manera
    }
  }
}