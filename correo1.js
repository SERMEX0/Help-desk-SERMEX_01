const bcrypt = require("bcrypt");

bcrypt.hash("sermexxx", 10, (err, hash) => {
  if (err) throw err;
  console.log("Contraseña encriptada:", hash);
});
