Vamos a trabajar en un proyecto usando el stack MERN

Mongo db
Express
React
Node JS

Primero lo subire a mi repositrio pero tu tendras que instalar las dependencias, en caso de fallar sigue los pasos para hacerlo de cero y solo vas tomando el codigo

Te deje una carpeta de img para que puedes ver las referencias

puedes notar que hay un archiivo llamado gitginore, esto lo que hace es ignorar subir algunos archivos al repositorio,
mayormente se usa para no subir las carpetas que se crean con las dependencias ya que son demasiados archivos

1- primer paso crea tu carpeta de proyecto donde. Esta carpera va 2 carpetas una de backend
y otra de frontend

2- navega a la crpeta de backend 
    cd backend
Y ejecuta los siguientes comandos. Todo esto dentro de la carpeta BackEnd
    npm init -y
    npm install express mongoose bcryptjs jsonwebtoken cors dotenv
    npm install --save-dev nodemon

3- Dentro de la carpeta Backend crea las siguientes carpetas
    config 
    controllers 
    middleware 
    models 
    routes

4- EN la raiz de backend crea un archivo .env con las siguientes caracteristicas
    MONGO_URI=cadena_de_conexion_mongo -> img/cadena_de_conexion
    JWT_SECRET=jwt_clave_secret
    -> ver ejemplo img/ejemplo_env

4.1- La mongo URI la sacas del mongoCompass dando click a los puntos y ahi te copia
el JWT lo puedes genear desde https://www.lastpass.com/features/password-generator
solamente genera una de 35 de longitud con todos los caracteres

5- apartir de aqui vas a tener que controlar tus versiones en tu repo