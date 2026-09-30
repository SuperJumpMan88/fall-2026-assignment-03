import { db, User, NewUser } from '../db/database.js';

export async function getAllUsers(): Promise<User[]> {
  return await db
    .selectFrom('users')
    .selectAll()
    .orderBy('id', 'asc')
    .execute();
}

export async function getUserById(id: number): Promise<User | undefined> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}

export async function createUser(user: NewUser): Promise<User> {
  return await db
    .insertInto('users')
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
}
