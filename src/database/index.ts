import { createConnection } from 'typeorm';

export default async () => {
  return await createConnection();
}

