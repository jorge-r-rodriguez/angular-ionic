# PrestaShop App con Angular + Ionic

Aplicacion movil desarrollada con Angular + Ionic que consume la API de PrestaShop para mostrar un catalogo de productos y su detalle.

## Stack tecnico
- Angular `20.3.20`
- Angular CLI `20.3.25`
- Ionic Angular `8.7.18`
- Capacitor `8.1.0`
- TypeScript `5.9.3`
- RxJS `7.8`
- SCSS
- Android Gradle Plugin `8.8.0`
- Gradle Wrapper `8.10.2`

## Funcionalidades
- Login de demostracion, sin autenticacion real.
- Perfil con datos ficticios.
- Catalogo de productos con imagen, nombre y precio.
- Buscador por nombre con filtro en tiempo real.
- Orden por destacados, nombre y precio.
- Paginacion de productos.
- Detalle de producto con imagen, precio y descripcion.
- Estados de carga, error y listado vacio.
- Navegacion con Angular Router.
- Soporte Android mediante Capacitor.

## Endpoints usados
- `GET /products?display=[id,name,price,id_default_image]&output_format=JSON`
- `GET /products/{id}?output_format=JSON`
- Imagen de producto: `/images/products/{productId}/{imageId}`

## Estructura principal
```text
src/app/
  mappers/
    product.mapper.ts
  models/
    prestashop-product.ts
    product.ts
  pages/
    login/
    profile/
    products/
    product-detail/
  services/
    api.service.ts
    product-catalog.service.ts

src/assets/config/
  local-config.example.json
  local-config.json  (local, ignorado por Git)

src/environments/
  environment.ts
  environment.prod.ts
```

## Requisitos
- Node.js `22+` recomendado.
  - Capacitor CLI 8 exige Node `>=22`.
  - Con Node 20 puede compilar Angular, pero `npx cap sync android` falla.
- npm.
- Android Studio.
- JDK incluido en Android Studio o JDK compatible con Gradle/AGP.
- Android SDK instalado.

## Configurar API key
La API key real no se versiona en GitHub.

Crear el archivo local:
```bash
cp src/assets/config/local-config.example.json src/assets/config/local-config.json
```

En Windows PowerShell:
```powershell
Copy-Item src\assets\config\local-config.example.json src\assets\config\local-config.json
```

Editar `src/assets/config/local-config.json`:
```json
{
  "apiKey": "TU_API_KEY_PRESTASHOP"
}
```

Ese archivo esta en `.gitignore`. Durante el build web se copia a `www/assets/config/local-config.json` y durante `npx cap sync android` se copia al proyecto Android, por lo que la app queda funcional sin subir la clave al repositorio.

Los archivos `src/environments/environment*.ts` mantienen `REPLACE_WITH_PRESTASHOP_API_KEY` como fallback seguro.

## Instalacion
```bash
npm install
```

## Levantar en navegador
```bash
npm run start
```

La app queda disponible en:
```text
http://localhost:4200
```

El entorno web local usa proxy (`proxy.conf.json`) para evitar problemas de CORS contra PrestaShop.

## Build web
Build production:
```bash
npm run build
```

Build development:
```bash
npm run build -- --configuration development
```

Salida:
```text
www/
```

## Android
Sincronizar assets web y configuracion de Capacitor:
```bash
npx cap sync android
```

Abrir en Android Studio:
```bash
npx cap open android
```

Desde Android Studio:
- `Build > Make Project`
- Ejecutar en emulador/dispositivo
- Generar APK desde `Build > Build APK(s)`

## Generar APK por consola
Primero generar el build web y sincronizar Capacitor:
```bash
npm run build
npx cap sync android
```

Luego compilar Android:
```bash
cd android
gradlew assembleDebug
```

En PowerShell, si `JAVA_HOME` no esta configurado y usas el JDK de Android Studio:
```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
cd android
.\gradlew.bat assembleDebug
```

APK generado:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Calidad y verificacion
Lint:
```bash
npm run lint
```

Tests unitarios:
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Auditoria de dependencias:
```bash
npm audit --audit-level=moderate
```

Flujo recomendado de verificacion:
```bash
npm audit --audit-level=moderate
npm test -- --watch=false --browsers=ChromeHeadless
npm run lint
npm run build
npx cap sync android
cd android
gradlew assembleDebug
```

## Versiones Android
- App ID: `io.ionic.starter`
- App name: `SDI App`
- `compileSdk`: `36`
- `targetSdk`: `36`
- `minSdk`: `24`
- Android Gradle Plugin: `8.8.0`
- Gradle Wrapper: `8.10.2`
- `cordova-android`: `14.0.1`

## Notas tecnicas
- `ApiService` centraliza las llamadas al Webservice de PrestaShop.
- En web local se usa `/api` con proxy.
- En Android nativo se usa `CapacitorHttp` para evitar restricciones CORS del WebView.
- La respuesta de PrestaShop se normaliza en `product.mapper.ts`.
- Se fuerza tema claro para mantener consistencia visual.
- Se usa safe area inferior para evitar superposicion con la barra de navegacion del sistema.
- El login es solo demostrativo.

## APK publicado
APK de referencia:

[Descargar APK (app-debug.apk)](https://github.com/jorge-r-rodriguez/angular-ionic/releases/download/v1.0/app-debug.apk)
