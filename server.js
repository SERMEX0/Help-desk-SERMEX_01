require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos de React (build)
app.use(express.static(path.join(__dirname, "build")));



const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // <-- Añade esta línea
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error(" Error de conexión a MySQL:", err);
    return;
  }
  console.log(" Conectado a MySQL");
});

// Configuración OAuth2 para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Middleware para autenticar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || "secreto", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ----- RUTAS API Y FUNCIONALIDAD -----

// 🔐 Ruta de Login
app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Error al comparar contraseña" });
      if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id, correo: user.correo }, process.env.JWT_SECRET || "secreto", { expiresIn: "1h" });

      res.json({ 
        mensaje: "Inicio de sesión exitoso", 
        token,
        user: {
          id: user.id,
          correo: user.correo
        }
      });
    });
  });
});

// 🔏 Ruta para Registrar Usuario
app.post("/register", (req, res) => {
  const { correo, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Error al encriptar contraseña" });

    db.query("INSERT INTO usuarios (correo, password) VALUES (?, ?)", [correo, hash], (err, result) => {
      if (err) return res.status(500).json({ error: "Error al registrar usuario" });

      res.json({ mensaje: "Usuario registrado correctamente" });
    });
  });
});

// Ruta para enviar correo de garantía
app.post('/api/enviar-garantia', authenticateToken, async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { vendedorEmail, datosFormulario, documentoBase64, imagenes } = req.body;
  
  try {
    if (!documentoBase64) {
      return res.status(400).json({ 
        success: false,
        error: 'El documento está vacío' 
      });
    }

    const attachments = [{
      filename: `garantia_${Date.now()}.docx`,
      content: documentoBase64,
      encoding: 'base64'
    }];

    if (imagenes && imagenes.length > 0) {
      imagenes.forEach((img, index) => {
        const extension = img.name.split('.').pop().toLowerCase();
        attachments.push({
          filename: `imagen_${index + 1}.${extension}`,
          content: img.data,
          encoding: 'base64',
          contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`
        });
      });
    }

    const mailOptions = {
      from: `"SERMEX" <${process.env.GMAIL_USER}>`,
      to: vendedorEmail,
      subject: `Garantía - ${datosFormulario.CLIENTE || 'Cliente'}`,
      html: `<p>Solicitud de garantía enviada</p>`,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true,
      message: 'Correo enviado correctamente',
      attachments: attachments.length
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al enviar el correo',
      details: error.message
    });
  }
});

// Ruta para obtener lista de vendedores
app.get('/api/vendedores', authenticateToken, (req, res) => {
  const vendedores = [
    { id: 1, nombre: "Efren Castillo", email: "ecastillo@sermex.mx" },
    { id: 2, nombre: "Jhonatan Zavala", email: "jzavala@sermex.mx" },
    { id: 3, nombre: "Osvaldo", email: "julioosvaldoguzmancorrea53@gmail.com" }
  ];
  res.json(vendedores);
});

// 📝 Ruta para enviar evaluación
app.post("/api/evaluaciones", authenticateToken, (req, res) => {
  const { producto_id, puntuacion, comentario, sugerencias } = req.body;
  const usuario_id = req.user.id;

  db.query(
    "INSERT INTO evaluaciones_productos (usuario_id, producto_id, puntuacion, comentario, sugerencias) VALUES (?, ?, ?, ?, ?)",
    [usuario_id, producto_id, puntuacion, comentario, sugerencias],
    (err, result) => {
      if (err) {
        console.error("Error al guardar evaluación:", err);
        return res.status(500).json({ error: "Error al guardar evaluación" });
      }
      res.json({ mensaje: "Evaluación guardada correctamente" });
    }
  );
});

// 🔍 Ruta para obtener evaluaciones de un producto
app.get("/api/evaluaciones/:producto_id", (req, res) => {
  const { producto_id } = req.params;

  db.query(
    `SELECT e.*, u.correo 
     FROM evaluaciones_productos e
     JOIN usuarios u ON e.usuario_id = u.id
     WHERE e.producto_id = ?`,
    [producto_id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener evaluaciones:", err);
        return res.status(500).json({ error: "Error al obtener evaluaciones" });
      }
      res.json(results);
    }
  );
});

// Obtener producto por ID
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener producto" });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(results[0]);
  });
});

// 📧 Ruta de prueba para correos
app.get('/test-mail', async (req, res) => {
  try {
    await transporter.sendMail({
      to: 'julioosvaldoguzmancorrea53@gmail.com',
      from: `"Prueba SERMEX" <${process.env.GMAIL_USER}>`,
      subject: 'PRUEBA SERMEX - ' + new Date().toLocaleTimeString(),
      text: 'Si recibes esto, el correo está bien configurado',
      html: '<p>Este es un <strong>correo de prueba</strong> enviado desde SERMEX</p>'
    });
    res.send('✅ Correo de prueba enviado! Revisa tu bandeja de entrada y spam');
  } catch (error) {
    console.error('❌ Error en prueba:', error);
    res.send(`❌ Error: ${error.message}`);
  }
});

// Obtener logística por correo
app.get('/api/logistica/:correo', (req, res) => {
  const { correo } = req.params;
  db.query(
    `SELECT * FROM logistica WHERE correo_cliente = ? ORDER BY fecha_creacion DESC`,
    [correo],
    (err, results) => {
      if (err) {
        console.error("Error en BD:", err);
        return res.status(500).json({ error: "Error al consultar" });
      }
      res.json(results);
    }
  );
});

// 🔐 Ruta para cambiar contraseña
app.post("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const [user] = await db.promise().query("SELECT password FROM usuarios WHERE id = ?", [userId]);
    if (!user.length) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) return res.status(401).json({ error: "Contraseña actual incorrecta" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.promise().query("UPDATE usuarios SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ success: true, message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error en change-password:", error);
    res.status(500).json({ error: "Error en el servidor al cambiar contraseña" });
  }
});

// Ruta para actualizar estado logístico
app.put('/api/logistica/actualizar', (req, res) => {
  const { rma_id, nuevo_estado, notas } = req.body;

  if (!rma_id || !nuevo_estado) {
    return res.status(400).json({ error: "Los campos 'rma_id' y 'nuevo_estado' son obligatorios" });
  }

  db.query(
    `UPDATE logistica SET 
      estado = ?, 
      detalles = ?,
      fecha_actualizacion = CURRENT_TIMESTAMP 
      WHERE rma_id = ?`,
    [nuevo_estado, notas || null, rma_id],
    (err, result) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).json({ error: "Error interno al actualizar" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No se encontró el RMA especificado" });
      }
      res.json({ success: true, message: "Estado actualizado correctamente" });
    }
  );
});

// Ruta de prueba simple
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "¡El servidor responde correctamente!" });
});

// ===== AL FINAL: Catch-all para servir React frontend =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});