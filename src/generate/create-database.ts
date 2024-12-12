import { config } from 'dotenv';
import postgres from 'postgres';
config({ path: '.env' });

async function createDatabase() {
  const sql = postgres(process.env.DATABASE_URL!, { database: 'postgres' });
  
  try {
    await sql`CREATE DATABASE schedule_manager`;
    console.log('Database created successfully');
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error);
    }
  } finally {
    await sql.end();
  }
}

createDatabase();