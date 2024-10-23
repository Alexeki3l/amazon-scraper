import * as dotenv from 'dotenv';
dotenv.config();

function getDatabaseType() {
  const databaseType: string = `${process.env.DATABASE_TYPE}`;
  if (!databaseType) {
    throw new Error('DATABASE_TYPE environment variable is not set');
  }
  switch (databaseType) {
    case 'mysql':
    case 'postgres':
    case 'mariadb':
      // add all database types
      return databaseType;
    default:
      throw new Error(`Invalid DATABASE_TYPE: ${databaseType}`);
  }
}
export function ConfigDatabase() {
  const dir = __dirname.split('\\').slice(0, -1).join('/');
  return {
    type: getDatabaseType(),
    host: `${process.env.DATABASE_HOST}`,
    port: parseInt(process.env.DATABASE_PORT),
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    entities: [`${dir}/**/*.entity{.ts,.js}`],
    synchronize: `${process.env.SYNCHRONIZE}` === 'true' ? true : false, // Esto creará las tablas automáticamente (solo para desarrollo)
    database: `${process.env.DATABASE_NAME}`,
    retryAttempts: 100, // numeros de intentos de conectarse a la base de datos
    retryDelay: 3000, //tiempo de retraso de un intento y otro.
    // autoLoadEntities: true, // las entidades se cargaran automaticamente
    // logging: true,
  };
}
