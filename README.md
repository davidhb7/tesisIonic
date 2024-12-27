# Aplicación Acua Report.
  La finalidad de esta aplicación, es brindar un apoyo a los acueductos comunitarios de las zonas rurales del Valle del Cauca, con enfasis en la mejora tecnológica 
  y de atención al cliente, dando solución a los hallazgos comunitarios pertinentes con el acueducto comunitario (Red hidraulica) y alcantarillado.

## Los usuarios clientes del acueducto pueden:
  * Autenticarse y ser identificados en la aplicación.
  * Realizar reportes o solicitudes con relacion al acueducto, con base a daños o mantenimiento.
  * Monitorear los reportes o solicitudes que estos puedan haber realizado.

## Los usuarios de la empresa:
  * Monitorear y gestionar los reportes o solicitudes a solucionar.
  * Visualización de ruta y ubicacion del reporte o solicitud que requiere atención. Permite a los contratistas llegar oportunamente y con exactitud al lugar.
  * Retroalimentación al usuario solicitante y cambio de estados del reporte atendido.
  * Gráfico de barras de reportes atendidos y el tipo de solución.
  * Visualización de "clusters" en el mapa, concentración cuantitativa de reportes por zonas.
  * Visualización de reportes individuales y su respectivo resumen.


# Tecnologías implementadas en esta solución:
  * Angular en frontend,  para la realización de vistas y organización de funcionalidades para la aplicación.
  * Firebase en backend, para la realización de servicios encargados del trafico de datos; CRUD en general y de forma específica.
  * FireStore en base de datos, para la gestión de información y de entidades responsables  de la aplicación.
  * FireStorage en la base de datos, para la gestion de contenido multimedia(fotos especificamente).
  * Firebase Authentication, para la implementación de seguridad y autenticacion (Inicio de sesion y registro) permitiendo oficializar el usuario.
  * Google maps API, para el apoyo de las funcionalidades de la aplicación como diferenciador de producto (Geolocalizacion, rutas y Clusters).
  * Apex Chart, para el analisis estadistico de reportes sin solucionar y solucionados (segun su tipo de arreglo), para la realización de planes de mejora y prevención empresarial

### LIBRERIAS BASE FIREBASE:
  https://firebase.google.com/docs/web/setup#available-libraries

### LIBRERIAS DE AUTH:
  https://firebase.google.com/docs/auth/web/manage-users?hl=es-419
  
### ICONOS:
  * https://www.flaticon.es/
  * https://ionic.io/ionicons
  
### DISEÑO DE VISTAS DE COMPONENTES:
  * https://ionicframework.com/docs/
  
### URL DEL DESPLIEGUE:
  * https://ionic-gest-rep-all.web.app

### GRAFICOS:
  * Base: https://www.youtube.com/watch?v=MwWzSJnkrgQ&t=59s
  * Implementación ApexCharts: https://github.com/apexcharts/ng-apexcharts/tree/master
  * https://apexcharts.com/angular-chart-demos/

### Comando actualizacion de Despliegue
  * ionic build --prod ||  npm run ionic:build --prod
  * firebase deploy

### Comando sincronización/creación Android
  * ionic capacitor build android (sincronizacion y creacion) 
  * npx ionic cap run android (compilación y ejecución)
