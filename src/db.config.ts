import * as dotenv from 'dotenv';
// import { Product } from './product/entities/product.entity';
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
  return {
    type: getDatabaseType(),
    host: `${process.env.DATABASE_HOST}`,
    port: 5432,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    synchronize: process.env.SYNCHRONIZE === 'true' ? true : false, // Esto creará las tablas automáticamente (solo para desarrollo)
    database: `${process.env.DATABASE_NAME}`,
  };
}
