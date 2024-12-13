import { config } from 'dotenv';
import postgres, { PostgresError } from 'postgres';
config({ path: '.env' });

async function createDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }
  
  const sql = postgres(process.env.DATABASE_URL, { database: 'postgres' });
  
  try {
    await sql`CREATE DATABASE schedule_manager`;
    console.log('Database created successfully');
  } catch (error) {
    if ((error as PostgresError).code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error);
    }
  } finally {
    await sql.end();
  }
}

createDatabase();