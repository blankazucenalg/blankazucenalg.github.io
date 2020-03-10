---
layout: post
title: "Configurar diferentes proyectos Angular en un mismo dominio en Nginx"
date: 2018-07-03
author: Blanca López
image: /assets/images/angular-nginx.png
imageAltText: Angular y NGINX
categories: devops
tags: [Angular, nignx, devops, server, config]
---

En ocasiones se desarrollan de manera independiente proyectos relacionados, que queremos que se muestren bajo un mismo dominio de origen, ¿cómo configuramos esto en nginx?
Si alguna vez has tenido que desarrollar proyectos independientes que al final debes desglosar en el mismo origen, tal vez esto puede serte util

## Configuración general de nginx

Dentro de los archivos de configuración de nginx, se necesita especificar la configuración para el dominio que estamos levantando. Esto lo lograremos generando un archivo en `/etc/nginx/sites-available` con la configuración correspondiente.

```
{
  server example.com # el dominio que vamos a utilizar

  location / {
    alias /path/to/our/dist/folder;
    try_files $uri$args $uri$args/ $uri/ /index.html =404;
  }
}
```
