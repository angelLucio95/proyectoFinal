Vamos a trabajar en un proyecto usando el stack MERN

Mongo db
Express
React
Node JS

Estructura de carpetas:
Crea una carpeta para tu proyecto. Dentro de esta carpeta, crea dos subcarpetas: una para el backend y otra para el frontend.
Backend:
Navega a la carpeta del backend:
cd backend

Ejecuta los siguientes comandos dentro de la carpeta backend:
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon

Carpetas en el backend:
Dentro de la carpeta backend, crea las siguientes subcarpetas:
config
controllers
middleware
models
routes

Archivo .env:
En la raíz de la carpeta backend, crea un archivo llamado .env con las siguientes variables:
MONGO_URI=tu_cadena_de_conexion_mongo
JWT_SECRET=tu_clave_secreta_para_jwt

La cadena de conexión MongoDB la puedes obtener desde MongoDB Compass haciendo clic en los puntos suspensivos y copiando la cadena.
Para generar la clave secreta JWT, puedes usar un generador de contraseñas como LastPass. Asegúrate de generar una clave de 35 caracteres con todos los tipos de caracteres.

Te deje una carpeta de img para que puedas ver las referencia de algunos pasos
