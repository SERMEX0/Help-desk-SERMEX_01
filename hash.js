const bcrypt = require("bcrypt");

// Lista de usuarios con sus contraseñas en texto plano
const usuarios = [
  { nombre: "Admin", correo: "admin@sermex.com", password: "123456" },
  { nombre: "Carlos", correo: "carlos@sermex.com", password: "sermexxx" },
  { nombre: "Prueba", correo: "prueba@sermex.mx", password: "sermex123" },
  { nombre: "osvaldo", correo: "osvaldo@sermex.mx", password: "sermex1234" },
  { nombre: "Julio", correo: "julioosvaldoguzmancorrea53@gmail.com", password: "+julioo+" },
  { nombre: "Osvaldo", correo: "osvaldoguzmancorrea@gmail.com", password: "123456" },
  // Puedes seguir agregando más usuarios aquí
];

// Recorrer la lista y generar hashes
usuarios.forEach((usuario) => {
  bcrypt.hash(usuario.password, 10, (err, hash) => {
    if (err) throw err;

    console.log("================================");
    console.log(`Nombre: ${usuario.nombre}`);
    console.log(`Correo: ${usuario.correo}`);
    console.log(`Password original: ${usuario.password}`);
    console.log(`Password encriptado: ${hash}`);
    console.log("================================");
  });
});
