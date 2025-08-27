/* src/routes/chat/[username]/+page.server.ts */
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) throw redirect(302, 'main/therapists');

  const partner = await db
    .select()
    .from(table.user)
    .where(eq(table.user.username, params.username))
    .then((rows) => rows.at(0));

  if (!partner) throw redirect(302, '/main/Therapists');
  if (partner.id === locals.user.id) throw redirect(302, '/main/Chats'); // prevent self-DM

  return {
    user: locals.user,
    partner
  };
};
