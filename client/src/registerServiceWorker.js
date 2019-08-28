/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "La aplicación está siendo servida a través de un service worker cacheado.\n" +
          "Para más detalles, visite https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("El service worker ha sido registrado.");
    },
    cached() {
      console.log("El contenido ha sido cacheado para uso offline.");
    },
    updatefound() {
      console.log("Nuevo contenido está siendo descargado.");
    },
    updated() {
      console.log("Hay nuevo contenido disponible, por favor refresque.");
    },
    offline() {
      console.log(
        "No se ha encontrado conexión a internet. La aplicación correrá en modo offline."
      );
    },
    error(error) {
      console.error("Error durante el registro del service worker:", error);
    }
  });
}
