# Logitrack API

API Backend para el Sistema Web de Gestión Logística de una Empresa de Transportes (adaptado a la normativa de México). Desarrollado con Node.js, Express, TypeScript y Prisma ORM.

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (En ejecución local o remota)

## Configuración del Entorno

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto copiando las variables necesarias. Ejemplo:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/logitrack?schema=public"
   ```

## Base de Datos (Prisma)

Después de configurar el `DATABASE_URL` en tu `.env`, necesitarás preparar la base de datos:

1. **Sincronizar base de datos y generar Prisma Client**:
   Si es tu primera vez levantando el proyecto y la base de datos está vacía, ejecuta el siguiente comando para aplicar las migraciones existentes en la carpeta `prisma/migrations`:
   ```bash
   npx prisma migrate deploy
   ```
   *(Nota: Opcionalmente, puedes ejecutar `npx prisma generate` si detectas problemas con los tipos de TypeScript de Prisma).*

2. **Abrir panel visual de la base de datos (Opcional)**:
   Puedes gestionar los registros (usuarios, clientes, viajes, etc.) usando la interfaz web de Prisma:
   ```bash
   npx prisma studio
   ```

## Ejecución del Servidor

Para iniciar el servidor en entorno de desarrollo con recarga automática:

```bash
npm run dev
```

El servidor estará escuchando en `http://localhost:3000` (o el puerto definido en tu `.env`).