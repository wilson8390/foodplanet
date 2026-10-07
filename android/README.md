# Generación de APK para Android - Food Planet

Este directorio contiene la configuración oficial de Google **Trusted Web Activity (TWA)** y **Bubblewrap** para compilar la aplicación Food Planet en un archivo instalable **`.apk`** para Android.

---

## Opción 1: Generador Rápido en 1 Clic (Sin instalar programas)
Puedes generar y descargar el archivo `.apk` firmado directamente usando **PWABuilder** (herramienta oficial recomendada por Google y Microsoft):

1. Ingresa a [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Pega la URL de tu aplicación Food Planet.
3. Haz clic en **«Package for Stores / Android»**.
4. Selecciona **«APK / Android Package»** y descarga el archivo `.apk` generado.
5. Pásalo a tu celular Android y pulsa para instalar.

---

## Opción 2: Compilación con Bubblewrap CLI (Línea de comandos)
Si tienes Node.js y Android SDK en tu máquina:

```bash
# 1. Instalar la herramienta oficial de Google
npm install -g @bubblewrap/cli

# 2. Inicializar proyecto desde el manifest
bubblewrap init --manifest=https://<TU-DOMINIO>/manifest.json

# 3. Compilar el archivo .apk firmado
bubblewrap build
```

El archivo generado estará listo en:
`app-release-signed.apk`

---

## Opción 3: Instalación Nativa WebAPK en Android (Directa en el celular)
En cualquier teléfono o tablet Android (Samsung, Xiaomi, Motorola, etc.):
1. Abre Google Chrome o Samsung Internet.
2. Ingresa a la URL del restaurante.
3. Presiona el botón **«📱 Instalar en Android»** o los 3 puntos `(⋮)` -> **«Instalar aplicación»**.
4. Android compila e instala la APK nativa directamente con el ícono de Food Planet en tu pantalla de inicio y menú de apps.
