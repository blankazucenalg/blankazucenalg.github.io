---
layout: post
title: Básicos de D3.js
date: 2018-09-05
author: Blanca López
category: Dev
tags: [front end, javascript, dataviz, d3]
---

![alt text](../assets/images/parallax1.jpg)

D3.js es una biblioteca JavaScript diseñada para la creación de visualizaciones interactivas utilizando tecnologías como HTML, CSS y SVG.

En general es una herramienta flexible capaz de permitirnos transformar el contenido de una página para representar visualmente información existente en JavaScript. Pero, ¿cómo funciona? 

Primero que nada, se encuentran los métodos `select()` y `selectAll()`  que nos permiten, como su nombre lo indica, seleccionar elementos (nodos) del *DOM* (Document Object Model) que compone nuestra página. Existen varios tipos de selectores que podemos utilizar.

* **Elemento:** Permite seleccionar el o los elementos que concuerden con el tipo de etiqueta

  ```javascript
  d3.select('div');
  d3.selectAll('p');
  d3.selectAll('svg circle');
  ```

* **Clase:** Todos los elementos que concuerden con un nombre de clase

  ```javascript
  d3.select('.dropdown');
  d3.selectAll('.card-content');
  d3.selectAll('.square');
  ```

* **Id:**  Permite seleccionar el elemento que tiene ese id único

  ```javascript
  d3.select('#main-chapter');
  ```

Estos métodos nos permiten seleccionar elementos con una ligera diferencia: _select_ obtiene el **PRIMER** elemento que encuentra, mientras que _selectAll_ devuelve en la selección todos los elementos que empaten con el selector.

