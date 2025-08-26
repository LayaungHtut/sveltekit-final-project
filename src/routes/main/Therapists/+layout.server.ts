/* import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { LayoutServerData } from "./$types";


export const load:LayoutServerData = async ({ locals }) => {
    return { user: locals.user };
}



export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/auth/lucia/login');
	}
};
 */

import type { LayoutServerLoad } from "./$types";

export const load:LayoutServerLoad = async ({ locals }) => {
    return { user: locals.user };
}