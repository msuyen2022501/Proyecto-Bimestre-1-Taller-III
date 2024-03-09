import jwt from "jsonwebtoken";
import Usuario from "../user/user.model.js";

export const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  console.log("Token recibido:", token);

  if (!token) {
    console.log("No se encontró ningún token en la solicitud");
    return res.status(401).json({
      mensaje: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    console.log("Token validado correctamente. ID de usuario:", uid);

    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      console.log("El usuario no existe en la base de datos");
      return res.status(401).json({
        mensaje: "Usuario no existe en la base de datos",
      });
    }

    if (!usuario.estado) {
      console.log("El usuario tiene estado 'false'");
      return res.status(401).json({
        mensaje: "Token no válido - usuario con estado:false",
      });
    }

    req.usuarioId = uid;

    next();
  } catch (e) {
    console.error("Error al validar el token:", e);
    res.status(401).json({
      mensaje: "Token no válido",
    });
  }
};
