import { randomBytes } from 'crypto';
import { hash, verify } from '@node-rs/argon2';

const ARGON2_OPTIONS = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export function generateResetToken() {
	return randomBytes(32).toString('hex');
}

export async function hashPassword(password: string) {
	return await hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(password: string, passwordHash: string) {
	return await verify(passwordHash, password, ARGON2_OPTIONS);
}
