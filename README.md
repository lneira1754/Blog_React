# MiniBlog React

Frontend en React (Vite + PrimeReact) para el sistema de mini blog con autenticación JWT, gestión de publicaciones y panel administrativo.

## Integrantes
- Leonardo Neira — GitHub: [lneira1754](https://github.com/lneira1754)
- Pérez Lucas Javier — GitHub: [LucasJavierPerez](https://github.com/LucasJavierPerez)

## Backend (API Flask)
- Base URL en desarrollo: [`http://localhost:5000/api`](http://localhost:5000/api)
- Asegúrate de tener el servidor Flask corriendo antes de iniciar el frontend. Ajusta `src/services/api.js` si usas otro host o puerto.

## Instalación y ejecución
1. **Requisitos**
   - Node.js 18+ y npm
   - Backend Flask disponible en `http://localhost:5000/api`
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   - Vite abrirá la app en `http://localhost:3000`. El `vite.config.js` ya incluye un proxy para `/api` hacia `http://localhost:5000`; si prefieres usar el proxy, cambia `API_BASE_URL` en `src/services/api.js` a `/api`.
4. **Build para producción**
   ```bash
   npm run build
   ```
   - El output listo para servir queda en `dist/`.

## Notas
- Las credenciales JWT se guardan en `localStorage`. Si cambias la clave o estructura del token del backend, actualiza `authService` (`src/services/auth.js`).
- Revisa los mensajes de error del backend Flask si ves respuestas `500` en el frontend; suele imprimirse el traceback con la causa exacta.
