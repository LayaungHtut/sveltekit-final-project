import { requestPasswordReset } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get('email');

    if (!email || typeof email !== 'string') {
      return json({ success: false }, { status: 400 });
    }

    await requestPasswordReset(email);
    return json({ success: true });
  }
};

