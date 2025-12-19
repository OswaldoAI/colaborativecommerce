# Registro de Pruebas (test_app.md)

Este archivo documentará las pruebas realizadas a los módulos y funcionalidades de la aplicación.

## Historial de Pruebas

| Fecha | Módulo/Archivo | Tipo de Prueba | Descripción | Resultado | Notas |
|-------|----------------|----------------|-------------|-----------|-------|
| 16-12-2025 | src/App.test.jsx | Unitario | Renderizado Inicial (Header, Hero, Features) | ✅ PASÓ | Vitest v2.1.8 |
| 18-12-2025 | src/components/Header.jsx | Visual/UI | Distribución y centrado de elementos (Search Bar) | ✅ Implementado | Ajuste de Flexbox y anchos |
| 18-12-2025 | Vercel Deployment | Infraestructura | Despliegue en producción y Serverless Functions | ⚠️ Pendiente | Requiere variables de entorno en Vercel Dashboard |
| 18-12-2025 | API Paths | Integración | Cambio de URLs absolutas a relativas (/api) | ✅ Corregido | Mejora portabilidad entre entornos |
| 18-12-2025 | Prisma Config | Build | Movimiento de Prisma a la raíz y scripts de postinstall | ✅ Corregido | Asegura generación de cliente en Vercel |
