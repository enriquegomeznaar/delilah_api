REQUERIMIENTOS.
-XAMPP o WAMPP
-postman
-nodejs 
-GIT

INSTALACION DE APACHE Y MYSQL

1.a Si aun no tenemos xampp o wampp en nuestra computadora, descargar uno de ellos, y luego inicializar los Modulos Apache y Mysql respectivamente en las configuracion de xampp o wampp.(un icono estara abajo en la barra de herramientras para abrir las configuraciones)

Nota: si al iniciar apache, no termina de arrancar. Podria llegar a ser que apache esta configurado por defecto en un puerto que la computadora ya esta utilizando, por lo tanto cambiar dicho puerto o cerrar dicha aplicacion que utiliza el puerto de apache y vuelva a arrancarlo.

1.b Una vez inicializado Apache y Mysql, necesitaremos instalar la DB del proyecto.
Para ello utilizaremos el IDE tanto sea heidiSQL o el mismo phpmyadmin.

PHPMYADMIN

1.c Dirigirse a la siguiente pagina en nuestro navegador para ingresar a nuestro phpmyadmin.

	http://localhost/phpmyadmin

1.d Luego dirigirse a la seccion Importar, que se encuentra en la barra superior.
Seleccionar el archivo "delilah.sql" donde se encuentra la base de dato a importar.

1.e Ejecutar la importacion

INSTALACION DEL PROYECTO y NODEJS

2.a Para empezar debemos tener instalado NODEJS, ingresando al siguiente link 

	https://nodejs.org/en/download/
	
Una vez instalado podremos instalar el proyecto.

2.b Crear una carpeta nueva y llamarla "delilah_api".

2.c Ingresar el siguiente comando de git para clonar los datos de la api, o descargar los datos del github y pasarlos a la carpeta "delilah_api".

	Git clone 

2.d Esto generara una carpeta llamada "app",otra llamada "config", y 3 archivos(server.js,package.json,package-lock.json)

2.e Abrir la consola del sistema operativo, ubicarse en la carpeta "delilah_api" utilizando el comando cd para navegar en los directorios del SO.

2.f Luego ingresar la siguiente linea para instalar las dependencias necesarias.

	npm install -save express body-parser jsonwebtoken mysql nodemon
 
Para iniciar el proyecto, debemos tener los modulos apache y mysql prendidos.
y luego en la terminal del sistema operativo ubicado en la carpeta del proyecto "delilah_api"
2.g Ejecutar el siguiente comando para poner en vivo la api.

	npm run dev

Apartir de ahora podremos realizar cualquier tipo de consultas con POSTMAN para probar la api.





