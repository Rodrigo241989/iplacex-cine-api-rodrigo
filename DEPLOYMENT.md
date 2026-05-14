# 🚀 Guía de Despliegue en Render

Guía paso a paso para desplegar la API cine-api en [Render](https://render.com/).

## 📋 Prerrequisitos

1. Cuenta en [Render](https://render.com/) (puedes usar GitHub para registrarte)
2. Repositorio en GitHub con el código de la API
3. Clúster en [MongoDB Atlas](https://cloud.mongodb.com/) configurado y funcionando

## Paso 1: Preparar el repositorio en GitHub

1. Crear repositorio en GitHub: `iplacex-cine-api-rodrigo`
2. Subir el código:
   ```bash
   git init
   git add .
   git commit -m "feat: proyecto cine-api listo para despliegue"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/iplacex-cine-api-rodrigo.git
   git push -u origin main
   ```

## Paso 2: Configurar MongoDB Atlas para Render

### Agregar IPs de Render a MongoDB Atlas

1. Ir a [MongoDB Atlas](https://cloud.mongodb.com/) → **Network Access**
2. Hacer clic en **"Add IP Address"**
3. Seleccionar **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Esto permite que Render se conecte desde cualquier IP
   - Es la opción más simple para el plan gratuito de Render
4. Hacer clic en **"Confirm"**

> 💡 **Nota:** Para mayor seguridad en producción, puedes agregar solo las IPs estáticas de Render (disponibles en planes de pago).

## Paso 3: Crear Web Service en Render

1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Hacer clic en **"New +"** → **"Web Service"**
3. Conectar tu repositorio de GitHub:
   - Seleccionar `iplacex-cine-api-rodrigo`
4. Configurar el servicio:

| Campo | Valor |
|-------|-------|
| **Name** | `iplacex-cine-api-rodrigo` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

## Paso 4: Configurar Variables de Entorno en Render

1. En la configuración del servicio, ir a la sección **"Environment Variables"**
2. Agregar la siguiente variable:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://cine_user:TU_PASSWORD@tu-cluster.mongodb.net/cine_db?retryWrites=true&w=majority` |

> ⚠️ **IMPORTANTE:** Reemplaza `TU_PASSWORD` y `tu-cluster` con tus datos reales de MongoDB Atlas.

3. Hacer clic en **"Create Web Service"**

## Paso 5: Verificar el despliegue

1. Esperar a que Render termine el build y despliegue (puede tardar 2-5 minutos)
2. Una vez desplegado, Render proporciona una URL como:
   ```
   https://iplacex-cine-api-rodrigo.onrender.com
   ```
3. Verificar que funciona:
   - Abrir la URL en el navegador
   - Respuesta esperada: `{"mensaje": "🎬 API Cine funcionando correctamente"}`
4. Probar un endpoint con Postman:
   - `GET https://iplacex-cine-api-rodrigo.onrender.com/api/peliculas`

## 🔧 Troubleshooting (Solución de Problemas)

### Error: "Application failed to respond"
- **Causa:** El servidor no está escuchando en el puerto correcto
- **Solución:** Asegurar que `server.js` usa `process.env.PORT`:
  ```javascript
  const PORT = process.env.PORT || 3000;
  ```

### Error: "MongoServerError: bad auth"
- **Causa:** Usuario o contraseña incorrectos en MONGODB_URI
- **Solución:** Verificar credenciales en MongoDB Atlas → Database Access

### Error: "MongoNetworkError: connection timed out"
- **Causa:** La IP de Render no tiene acceso al clúster
- **Solución:** En MongoDB Atlas → Network Access → agregar 0.0.0.0/0

### Error: "MONGODB_URI no está definida"
- **Causa:** No se configuró la variable de entorno en Render
- **Solución:** Ir a Render → tu servicio → Environment → agregar MONGODB_URI

### El servicio tarda mucho en responder
- **Causa:** El plan gratuito de Render "duerme" el servicio tras 15 min de inactividad
- **Solución:** La primera petición después de inactividad tarda ~30-60 segundos. Es normal en el plan gratuito.

### El build falla en Render
- **Causa:** Dependencias incompatibles o error en el código
- **Solución:**
  1. Revisar los logs en Render → tu servicio → Logs
  2. Verificar que `npm install` funciona localmente
  3. Verificar que `node server.js` funciona localmente

## 📝 Comandos de referencia

| Acción | Comando |
|--------|---------|
| Instalar dependencias | `npm install` |
| Iniciar servidor (producción) | `node server.js` |
| Iniciar servidor (desarrollo) | `npm run dev` |

## 🔄 Actualizar el despliegue

Cada vez que hagas `git push` a la rama `main`, Render re-desplegará automáticamente:

```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

Render detectará el push y ejecutará automáticamente el build y deploy.
