<script lang="ts">
	let sessions = $state([
		{ client: 'Alice Johnson', time: '10:00 AM', status: 'confirmed' },
		{ client: 'Bob Smith', time: '11:30 AM', status: 'pending' },
		{ client: 'Carol Lee', time: '2:00 PM', status: 'confirmed' }
	]);

	let sessionStatus = $state('');
	let completedSessions = $state<{ client: string; time: string }[]>([]);
	let countdown = $state<string | null>(null);

	function startSession(index: number) {
		const session = sessions[index];
		if (session.status === 'confirmed' || session.status === 'pending') {
			session.status = 'in progress';
			sessionStatus = `Session with ${session.client} started! Redirecting...`;

			setTimeout(() => {
				// Move session to completed
				completedSessions = [...completedSessions, { client: session.client, time: session.time }];
				session.status = 'completed';
				sessionStatus = '';
				// Example: navigate to chat
				// goto(`/client-chat/${session.client.replace(' ', '-').toLowerCase()}`);
			}, 1500);
		}
	}

	function startNextSession() {
		const nextSession = sessions.find((s) => s.status === 'confirmed');
		if (nextSession) startSession(sessions.indexOf(nextSession));
		else sessionStatus = 'No confirmed sessions available.';
	}

	// Countdown to next confirmed session
	$effect(() => {
		const next = sessions.find((s) => s.status === 'confirmed');
		if (!next) {
			countdown = null;
			return;
		}
		const [hours, minutes] = next.time.split(':');
		const sessionDate = new Date();
		sessionDate.setHours(parseInt(hours), parseInt(minutes), 0);

		const update = () => {
			const diff = sessionDate.getTime() - Date.now();
			if (diff <= 0) {
				countdown = 'Starting now!';
				return;
			}
			const mins = Math.floor(diff / 60000);
			const secs = Math.floor((diff % 60000) / 1000);
			countdown = `${mins}m ${secs}s`;
		};
		update();
		const timer = setInterval(update, 1000);
		return () => clearInterval(timer);
	});
</script>

<div class="flex-1 overflow-y-auto p-8" id="main-content">
	<section>
		<h2 class="mb-6 text-2xl font-semibold text-white">Hello, <em>Sir La Yung!</em></h2>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Upcoming Sessions Card -->
			<div class="card bg-black/30 shadow-lg hover:scale-105 transition-transform">
				<div class="card-body">
					<h3 class="text-lg font-bold text-white">Upcoming Sessions</h3>
					<ul class="space-y-2 text-white/90">
						{#each sessions as session, i}
							<li
								class="flex justify-between items-center bg-white/20 px-3 py-2 rounded-md cursor-pointer hover:bg-white/30"
								onclick={() => startSession(i)}
							>
								<span>{session.client} – {session.time}</span>
								<span
									class="badge {session.status === 'confirmed' 
										? 'badge-success' 
										: session.status === 'pending' 
											? 'badge-warning' 
											: session.status === 'in progress' 
												? 'badge-info' 
												: 'badge-neutral'}"
								>
									{session.status}
								</span>
							</li>
						{/each}
					</ul>
					{#if countdown}
						<p class="mt-2 text-sm text-white/70">⏳ Next session in {countdown}</p>
					{/if}
				</div>
			</div>

			<!-- Start Session Card -->
			<div class="card bg-black/30 shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
				<div class="text-center p-4">
					<p class="mb-4 text-lg font-bold text-white">Start Session</p>
					<button class="btn btn-circle text-2xl font-bold text-white" onclick={startNextSession}>+</button>
					<p class="mt-2 text-white/90">{sessionStatus}</p>
				</div>
			</div>

			<!-- Completed Sessions -->
			{#if completedSessions.length > 0}
				<div class="card bg-black/30 shadow-lg md:col-span-2">
					<div class="card-body">
						<h3 class="text-lg font-bold text-white">Completed Sessions ✅</h3>
						<ul class="mt-2 space-y-2 text-white/80">
							{#each completedSessions as cs}
								<li class="flex justify-between border-b border-white/20 pb-1">
									<span>{cs.client}</span>
									<span class="text-sm opacity-70">{cs.time}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			<!-- Resources Card -->
			<a href="/resources" class="card h-48 bg-black/30 shadow-lg hover:scale-105 transition-transform overflow-hidden">
				<img src="/src/lib/assets/images/pexels-pixabay-159751.jpg" class="absolute inset-0 h-full w-full object-cover opacity-70" alt="Resources" />
				<div class="absolute inset-0 flex items-center justify-center bg-black/30">
					<h3 class="text-lg font-bold text-white">Resources 📖</h3>
				</div>
			</a>

			<!-- Articles Card -->
			<a href="/articles" class="card h-48 bg-black/30 shadow-lg hover:scale-105 transition-transform overflow-hidden md:col-span-2">
				<img src="/src/lib/assets/images/article-71342_1920.jpg" class="absolute inset-0 h-full w-full object-cover opacity-70" alt="Articles" />
				<div class="absolute inset-0 flex items-center justify-center bg-black/30">
					<h3 class="text-lg font-bold text-white">Articles</h3>
				</div>
			</a>
		</div>
	</section>
</div>
