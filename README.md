
# StickerSmash Caballeros

Aplicación fullstack para gestión de caballeros y batallas de Saint Seiya. Incluye backend Node.js/Express (MongoDB) y frontend Expo/React Native con soporte para imágenes, gestos y despliegue seguro en Render.

---

## Características
- CRUD de caballeros y batallas
- Subida y visualización de imágenes (con ImagePicker y Multer)
- Gestos avanzados en imágenes (pinch, pan, double-tap)
- Responsive en móvil y web
- Backend seguro y desplegado en Render
- Variables de entorno para configuración segura

---

## Estructura del proyecto
```
├── app/                # Frontend Expo/React Native
│   ├── (tabs)/         # Pantallas principales
│   ├── components/     # Componentes reutilizables
│   └── ...
├── saintseiya-backend/ # Backend Node.js/Express
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── assets/             # Imágenes y recursos
├── .env                # Variables de entorno (no subir a GitHub)
├── package.json
├── README.md
└── ...
```

---

## Instalación y desarrollo

### 1. Clona el repositorio
```sh
git clone https://github.com/tu-usuario/stickersmash-caballeros.git
cd stickersmash-caballeros
```

### 2. Configura las variables de entorno
Crea un archivo `.env` en la raíz:
```
EXPO_PUBLIC_API_URL=http://localhost:3001   # Para desarrollo local
MONGODB_URI=tu_cadena_de_conexion           # Solo para backend
```
Agrega `.env` a `.gitignore`.

### 3. Instala dependencias
```sh
npm install
```

### 4. Ejecuta el backend
```sh
cd saintseiya-backend
npm install
node app.js
```

### 5. Ejecuta el frontend
```sh
cd ..
npx expo start
```

---

## Despliegue en Render

1. Sube el proyecto a GitHub.
2. Ve a https://dashboard.render.com/ y crea un nuevo Web Service.
3. Configura los comandos:
   - Build: `npm install`
   - Start: `node saintseiya-backend/app.js`
4. Agrega variables de entorno en Render:
   - `MONGODB_URI` (tu cadena de conexión)
   - `EXPO_PUBLIC_API_URL` (la URL pública de Render)
5. Render te dará una URL pública segura (HTTPS).
6. Actualiza `.env` en frontend con la URL pública para producción.

---

## Seguridad
- No subas `.env` ni credenciales a GitHub.
- Usa variables de entorno en Render.
- El backend valida y sanitiza los datos recibidos.
- CORS configurado para permitir solo orígenes necesarios.

---

## Tecnologías
- Node.js, Express, MongoDB, Mongoose
- Expo, React Native, React Native Gesture Handler, Reanimated
- Multer, ImagePicker
- Render (despliegue)

---

## Scripts útiles
- `npm run start`        # Inicia Expo
- `npm run android`      # Inicia en Android
- `npm run ios`          # Inicia en iOS
- `npm run web`          # Inicia en web
- `node saintseiya-backend/app.js` # Inicia backend

---

## Licencia
MIT

---

## Autor
- Yulet (tu nombre o usuario)
- Contacto: [tu-email]

---

## Contribuciones
¡Pull requests y sugerencias son bienvenidas!

---

## Demo
- [URL pública de Render](https://tu-app.onrender.com)

---

## Notas
- Para desarrollo local, usa tu IP en `.env` si pruebas en dispositivos físicos.
- Para producción, usa la URL pública de Render.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
