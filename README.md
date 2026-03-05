# Prueba tecnica Ionic + Angular + PrestaShop

## Objetivo
Aplicacion movil desarrollada con Ionic + Angular que consume el Webservice de PrestaShop para mostrar un catalogo de productos y su detalle.

## Stack tecnico
- Ionic 8
- Angular 20 (standalone components)
- Capacitor 8 (Android)
- TypeScript
- SCSS

Endpoints usados:
- `GET /products?display=[id,name,price,id_default_image]`
- `GET /products/{id}`
- Imagen de producto: `/images/products/{productId}/{imageId}`

## Funcionalidades implementadas
- Pantalla de login (sin autenticacion real, solo navegacion).
- Pantalla de perfil con datos ficticios.
- Listado de productos con:
  - imagen
  - nombre
  - precio
  - paginacion (10 elementos por pagina)
- Pantalla de detalle de producto con:
  - imagen
  - nombre
  - precio
  - descripcion
- Navegacion con Angular Router.
- Gestion de loading y errores.
- Diseno responsive orientado a movil.

## Estructura principal
```text
src/app/
  pages/
    login/
    profile/
    products/
    product-detail/
  services/
    api.service.ts
  models/
    product.ts

src/environments/
  environment.ts
  environment.prod.ts

src/theme/
  variables.scss
  mixins.scss
```

## Decisiones tecnicas
- Se usa `ApiService` centralizado para todas las llamadas al webservice.
- En entorno web local se usa proxy (`/api`) para evitar CORS durante desarrollo.
- En Android/iOS nativo se usa `CapacitorHttp` para evitar restricciones CORS del WebView.
- Se normaliza la respuesta del producto para:
  - tipado consistente
  - construccion de `imageUrl`
  - manejo de estructuras de texto multilenguaje
- Se fuerza tema claro para evitar diferencias de visualizacion entre emulador y dispositivo.
- Se agrego `safe-area` inferior para que paginador y botones no se superpongan con la barra de navegacion del sistema.
- Se utiliza la interfaz visual por defecto de Ionic (componentes base y estilos nativos de Ionic), sin un sistema de diseno custom avanzado.

## Requisitos previos
- Node.js 20+ recomendado
- npm
- Android Studio
- JDK 17 (requerido por AGP 8.x)

## Versiones Android del proyecto
Valores tomados de la configuracion del repositorio:

- Android Gradle Plugin (AGP): `8.8.0`
  - Archivo: `android/build.gradle`
- Gradle Wrapper: `8.10.2`
  - Archivo: `android/gradle/wrapper/gradle-wrapper.properties`
- compileSdk: `36`
- targetSdk: `36`
- minSdk: `24`
  - Archivo: `android/variables.gradle`
- Kotlin stdlib forzado en resolucion de dependencias: `1.8.22`
  - Archivo: `android/build.gradle`
- cordova-android: `14.0.1`
  - Archivo: `android/variables.gradle`

## Ejecucion web
Instalar dependencias:
```bash
npm install
```

Levantar en web:
```bash
npm run start
```

La app queda disponible en `http://localhost:4200` (o puerto configurado).

Con Ionic:
```bash
ionic serve
```

Build web:
```bash
npm run build -- --configuration development
```

Salida en: `www/`

## Android (Capacitor)
Sincronizar assets y configuracion:
```bash
npx cap sync android
```

Abrir proyecto Android:
```bash
npx cap open android
```

Desde Android Studio:
- `Build > Make Project`
- Ejecutar en emulador/dispositivo
- Generar APK: `Build > Build APK(s)`

## Build Android por consola (opcional)
Si se compila por CLI en vez de Android Studio, definir `JAVA_HOME` (JDK 17) y ejecutar:

```bash
cd android
gradlew assembleDebug
```

## Calidad de codigo
Lint:
```bash
npm run lint
```

## Entrega
- Repositorio Git con el codigo fuente.
- APK Android funcional.
- Instrucciones y decisiones tecnicas.

## APK Android
Descargar APK para instalacion directa en Android:

[Descargar APK (app-debug.apk)](https://github.com/jorge-r-rodriguez/angular-ionic/releases/download/v1.0/app-debug.apk)

El APK fue compilado y probado correctamente en **Android Studio** y en **dispositivo Android fisico**.

## Notas
- El login es de demostracion: no existe autenticacion real.
- El API Key esta en `environment` por tratarse de una prueba tecnica.
