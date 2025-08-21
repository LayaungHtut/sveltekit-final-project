<script lang="ts">
    let email = $state('');
    let message = $state('');
    let success = $state(false);
  
    async function submit(event: SubmitEvent) {
      event.preventDefault();
      const res = await fetch('/auth/lucia/forgot-password', {   
        method: 'POST',
        body: new FormData(event.target as HTMLFormElement),
      });
      const data = await res.json();
      if (data.success) {
        success = true;
        message = 'Check your email for the password reset link.';
      } else {
        message = 'Error sending reset link. Please try again.';
      }
    }
  </script>