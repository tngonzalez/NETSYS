// Middleware para verificar el token
module.exports.verifyToken = async (req, res, next) => {
    try {
      const bearerHeader = req.headers["authorization"];
      if (!bearerHeader) {
        return res.status(403).json({
          status: false,
          message: "Acceso denegado. Token no proporcionado.",
        });
      }
  
      const token = bearerHeader.split(" ")[1]?.trim();
      if (!token) {
        return res.status(403).json({
          status: false,
          message: "Acceso denegado. Token inválido.",
        });
      }
  
      // Verificar el token
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      
      // Buscar al usuario en la base de datos
      const user = await prisma.usuario.findUnique({
        where: { correo: verify.correo },
      });
  
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Usuario no encontrado.",
        });
      }
  
      req.user = { idUsuario: user.idUsuario, tipoRol: user.tipoRol, correo: user.correo };
      next();
    } catch (error) {
      console.error("Error al verificar token:", error);
      return res.status(401).json({
        status: false,
        message: "Token inválido o expirado.",
      });
    }
  };
  
  // Middleware para verificar roles específicos basados en `tipoRol`
  module.exports.grantRole = (roles) => {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            status: false,
            message: "No autorizado. Usuario no autenticado.",
          });
        }
  
        const { tipoRol } = req.user;
  
        // Verificar si el tipoRol del usuario está dentro de los roles permitidos
        if (!roles.includes(tipoRol)) {
          return res.status(403).json({
            status: false,
            message: "No autorizado. Permisos insuficientes.",
          });
        }
  
        next();
      } catch (error) {
        console.error("Error al verificar rol:", error);
        return res.status(500).json({
          status: false,
          message: "Error interno del servidor.",
        });
      }
    };
  };
  