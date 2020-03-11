---
layout: post
title: Como utilizar un proyecto de Vue como biblioteca de componentes
date: 2020-03-11
author: Blanca López
image: /assets/images/2020-03-11-construir-biblioteca-vue/image-20200311132557648.png
imageAltText: Vuejs componentes externos
categories: frontend
tags:
  [frontend, javascript, vue, library, webpack, vue-cli, vue-cli-service, build]
---

<!-- # Como utilizar un proyecto de Vue como biblioteca de componentes -->

Ultimamente he estado utilizando Vuejs para diferentes proyectos y en ocasiones me he encontrado con la necesidad de reutilizar ciertos componentes en otros proyectos. ¿Cómo podemos utilizar estos componentes en una biblioteca que pueda ser utilizada por otros proyectos? Afortunadamente, las herramientas de Vue nos permiten configurar _bundles_ en forma de biblioteca para exportar este tipo de componentes.

<!--more-->

Empezaremos por tener dos proyectos: uno que servirá como biblioteca de componentes y otro que dependerá de esta y utilizará los componentes.

Para empezar, utilizaremos el generador de Vue para estos proyectos

```bash
yarn global add @vue/cli

# biblioteca
vue create dummylib

# app
vue create testapp
```

Si corremos el proyecto utilizando `yarn serve` podremos ver el despliegue de la applicación demo en ambos proyectos.

Cuando se hace la construcción de un proyecto en Vue, por debajo se utiliza **webpack** para construir el sitio con los _assets_ y dependencias necesarias.

Supongamos que tenemos en `dummylib` un componente que queremos utilizar en `testapp`

```vue
<!-- TodayDateComponent -->
<template>
  <div>
    <p>Today is {{ todayDate }}</p>
  </div>
</template>
<script>
import * as moment from "moment";
export default {
  computed: {
    todayDate() {
      return moment().format("LL");
    }
  }
};
</script>
```

Este componente tiene como función solo desplegar la fecha actual, utilizando una dependencia externa como `moment.js`

![image-20200311114641501](/assets/images/2020-03-11-construir-biblioteca-vue/image-20200311114641501.png)

## Construir como biblioteca

Ahora, necesitamos declarar el archivo `main-lib.js` donde se especifique qué componentes vamos a exportar.

```javascript
// main-lib.js
import TodayDateComponent from "./components/TodayDateComponent.vue";
export default TodayDateComponent;
```

Si construimos normalmente el proyecto `dummylib` nos generará el sitio demo de Vue, necesitamos cambiar la configuración de construcción del proyecto a una biblioteca que exporte el contenido de `main-lib.js`

Afortunadamente, podemos usar el servicio de construcción de Vue para generar nuestro proyecto como una biblioteca en vez de un sitio web.

```bash
yarn global add @vue/cli-service-global
```

Para esto, utilizaremos `vue-cli-service` con el parámetro `--target lib` y un nombre para la biblioteca (`--name dummylib`) junto con la dirección del archivo en que se especifica los componentes exportados (`src/main-lib.js`).

El comando quedaría estructurado de la siguiente forma.

```bash
vue-cli-service build --target lib --name dummylib src/main-lib.js
```

Este comando podemos agregarlo a los comandos del archivo `package.json`

```json
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "build-lib": "vue-cli-service build --target lib --name dummylib src/main-lib.js",
  "lint": "vue-cli-service lint"
},
```

Para que otro proyecto pueda usar nuestra biblioteca construida, necesitamos decirle cuál de los archivos utilizará como principal al importarla. Para esto, debemos agregar la ruta `main` al `package.json`

```json
"main": "./dist/dummylib.common.js"
```

## Dependencias externas

Ahora, si solo la construimos así sin más, la configuración nos hará incluir todas las dependencias y archivos importados dentro de nuestro _bundle_.

![image-20200311122506476](/assets/images/2020-03-11-construir-biblioteca-vue/image-20200311122506476.png)

Para evitar esto, debemos modificar la configuración de **webpack** a través del archivo `vue.config.js`. Este archivo, nos permite incluir plugins de Vue para desarrollo (por ejemplo, pre-procesadores de HTML como Pug, o de CSS como SASS) y **extender** la configuración actual de webpack.

Para más información sobre las diferentes formas de configurar dependencias externas checa la [Documentación de Webpack: Externals](https://webpack.js.org/configuration/externals/#combining-syntaxes)

```js
/** vue.config.js */
module.exports = {
  // options...
  /** chainWebpack permite extender la config actual de webpack **/
  chainWebpack: config => {
    if (process.env.VUE_CLI_BUILD_TARGET === "lib") {
      /** Utilizamos solo esta configuración para el bundle de biblioteca */
      config.externals({
        moment: "moment"
      });
    }
  }
};
```

Al decirle que obtenga `moment` de dependencias externas, ya no lo incorporará en el bundle.

![image-20200311122758660](/assets/images/2020-03-11-construir-biblioteca-vue/image-20200311122758660.png)

## Utilizar en el proyecto de prueba

Ahora, en el proyecto `testapp` podemos utilizar este componente añadiendo `dummylib` como dependencia.

```
yarn add ../dummylib
```

> **Pro-tip:** Puedes usar `yarn link` para añadir la dependencia en modo de desarrollo en vez de usar la ruta relativa.
>
> ```bash
> # ~/.../dummylib $
> yarn link
> cd ../testapp
> yarn link "dummylib"
> yarn add "dummylib"
> ```

Después de añadir la dependencia, obtendríamos el componente dentro de `App.vue`

```vue
<!-- App.vue -->
<template>
  <!-- ... -->
  <today-date-component />
  <!-- ... -->
</template>

<script>
import TodayDateComponent from "dummylib";
export default {
  name: "App",
  components: {
    // ...
    TodayDateComponent
    // ...
  }
  // ...
};
</script>
```

![image-20200311125120341](/assets/images/2020-03-11-construir-biblioteca-vue/image-20200311125120341.png)

## ¿Qué pasa si mi componente usa Vuex store?

En este caso, la biblioteca se tendrá que exportar como un **plugin** de Vue para poder utilizar la instancia de _vuex store_ de la otra aplicación.

Suponiendo que tengamos un componente como este:

```vue
<!-- ./components/DummyButton.vue -->
<template>
  <div>
    <button @click="increment">{{ text }}</button>
  </div>
</template>
<script>
export default {
  computed: {
    times() {
      return this.$store.getters.counter !== 1 ? "times" : "time";
    },
    text() {
      return `I have been clicked ${this.$store.getters.counter} ${this.times}`;
    }
  },
  methods: {
    increment() {
      this.$store.commit("increment");
    }
  }
};
</script>
```

Que utiliza un módulo de _store_ como este:

```javascript
/** ./store/module.js */
const store = {
  state: {
    counter: 0
  },
  getters: {
    counter: state => state.counter
  },
  mutations: {
    increment(state) {
      state.counter += 1;
    }
  }
};
export default store;
```

Necesitamos modificar nuestro archivo `main-lib.js` para que en vez de simplemente exportar los componentes, exporte un plugin de Vue que requiere un store de Vuex.

```javascript
/** main-lib.js **/
import DummyButton from "./components/DummyButton.vue";
import TodayDateComponent from "./components/TodayDateComponent.vue";
import store from "./store/module";

export default {
  install(Vue, options) {
    if (!options || !options.store) {
      throw new Error("Please initialise plugin with a Vuex store.");
    }
    options.store.registerModule("dummylib", store);
    Vue.component("DummyButton", DummyButton);
    Vue.component("TodayDateComponent", TodayDateComponent);
  }
};
```

Y simplemente podemos reconstruir la biblioteca

```
yarn build-lib
```

### Utilizar en el app

En nuestra app, tendremos que utilizar `vuex` e inicializar nuestro _store_.

```bash
yarn add vuex
```

```javascript
/** ./store/index.js */

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({});
```

En nuestro archivo `main.js` de la app, debemos utilizar este store en la instancia de Vue, pero antes, inicializar nuestra biblioteca `dummylib` como plugin, pasándole el store.

```javascript
/** main.js **/
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

/** Add dummylib as plugin */
import dummylib from "dummylib";
Vue.use(dummylib, { store }); // store required

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
```

Al inicializar nuestra biblioteca como plugin, ya no es necesario hacer el import de los componentes en `App.vue` por lo que podemos solo utilizarlos en el _template_.

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <today-date-component />
    <dummy-button />
    <!-- ... -->
  </div>
</template>
```

Y _voilá_, ahora podemos hacer uso de ambos componentes dentro de `testapp`

![image-20200311132557648](/assets/images/2020-03-11-construir-biblioteca-vue/image-20200311132557648.png)

Utilizando la extensión de herramientas de Vue en el navegador podemos ver el estado del _store._

![image-20200311132547718](/assets/images/2020-03-11-construir-biblioteca-vue/image-20200311132547718.png)
