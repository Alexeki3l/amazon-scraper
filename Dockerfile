# Etapa 1: Construcción de la imagen
# -----------------------------------
# Usar una imagen base de Node.js
FROM node:18 AS builder

# Crear un directorio de trabajo para la aplicación
WORKDIR /app

# Copiar los archivos de configuración de NestJS y las dependencias
COPY package*.json ./

# Instalar playwright
RUN npm install @playwright/test

# Instalar las dependencias necesarias para la construcción de la aplicación
RUN npm install

# Copiar el código fuente de la aplicación al contenedor
COPY . .

# Construir la aplicación NestJS
RUN npm run start