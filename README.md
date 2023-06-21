# VECIRED BACKEND
```
En este archivo se encuentra el codigo creado por Luis Moyano y Nelson Dominguez.
El link al repositorio en github es https://github.com/LuisMoyanoIT/veciRed

El proposito de la clonacion de su proyecto en otra pagina es la preservacion del
codigo inicial y posterior creación de modulos aparte por los estudiantes:

-Norman Vergara Cruz
-Benjamín Oyarzo Gutierrez

de manera de completar el programa  y optar a la titulación por medio de este.

#Caracteristicas del programa
Node version 16.14
Python3
NPM (incluido en node) 8.5.0
Express (incluido en node)
curl
```

## Resolver problemas de uso de terminal en distribucion 18.04 ; Bionic beaver

En muchos casos , al instalar el sistema operativo o emularlo en una maquina virtual
 con ambiente grafico ,se tendra problemas al abrir el terminal, para resolverlo:

 * Presionar  CTRL + ALT + F3
 * Escribir los siguientes comandos:
 ```
 cd ..
 cd etc/default
 sudo nano locale
 ```
 * Cambiar "en_US" a "en_US.UTF-8"
 * Guardar los cambios con CTRL + S   y salir del archivo con CTRL + X
 * Escribir el siguiente comando:
 ```
 sudo locale-gen --purge
 ```
 * Aceptar todo lo necesario y una vez  termine reiniciar el sistema usando
 ```
 sudo reboot
 ```

 

---
## Instalar Node Version Manager en Ubuntu ; Bionic Beaver

Para poder ejecutar el codigo se debe descargar NVM (Node Version Manager),
para esto se debe descargar curl mediante terminal, usando el siguiente codigo:
```
sudo apt install curl 
```
una vez instalado, se debe ejecutar la siguiente linea:
```
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
```
una vez instalado, se debe  descargar la ultima version y despues, instalar la version necesaria
```
nvm install latest
nvm install 16.14.2
nvm use 16.14.2
```
