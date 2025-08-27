import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, ne, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, '/main');

  // opposite role
  const targetRole = locals.user.role === 'client' ? 'therapist' : 'client';

  // fetch only opposite-role users, exclude self
  const partners = await db
    .select({
      id: table.user.id,
      username: table.user.username,
      role: table.user.role
    })
    .from(table.user)
    .where(
      and(
        eq(table.user.role, targetRole),
        ne(table.user.id, locals.user.id) // 🚀 exclude self
      )
    );

  return {
    user: locals.user,
    partners
  };
};
