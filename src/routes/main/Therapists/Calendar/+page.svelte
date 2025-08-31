<script lang="ts">
	import { fly } from 'svelte/transition';

	// Current date
	let currentDate = $state(new Date());
	let currentMonth = $derived(currentDate.getMonth());
	let currentYear = $derived(currentDate.getFullYear());

	// Appointments storage
	let appointments = $state<Record<string, string>>({});

	// Slide panel state
	let selectedDay = $state<number | null>(null);
	let tempNote = $state("");

	const today = new Date();

	// Build calendar days
	let days = $derived(() => {
		const firstDay = new Date(currentYear, currentMonth, 1).getDay();
		const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
		const arr: (number | null)[] = [];

		for (let i = 0; i < firstDay; i++) arr.push(null);
		for (let d = 1; d <= lastDate; d++) arr.push(d);
		return arr;
	});

	// Sorted appointments for upcoming section
	let sortedAppointments = $derived(() => {
		return Object.entries(appointments)
			.map(([date, note]) => ({ date, note }))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	});

	// Open slide panel
	function openAppointment(day: number) {
		selectedDay = day;
		const key = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
		tempNote = appointments[key] || "";
	}

	// Save appointment
	function saveAppointment() {
		if (!selectedDay) return;
		const key = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
		if (tempNote.trim() === "") {
			const newApps = { ...appointments };
			delete newApps[key];
			appointments = newApps;
		} else {
			appointments = { ...appointments, [key]: tempNote };
		}
		selectedDay = null;
	}

	// Remove appointment
	function removeAppointment() {
		if (!selectedDay) return;
		const key = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
		const newApps = { ...appointments };
		delete newApps[key];
		appointments = newApps;
		selectedDay = null;
	}
</script>

<!-- MAIN -->
<main class="flex justify-center p-6">
	<div class="w-full max-w-3xl">
		<!-- Month controls -->
		<div class="flex items-center justify-between mb-4">
			<button class="btn btn-sm" onclick={() => (currentDate = new Date(currentYear, currentMonth - 1, 1))}>←</button>
			<h2 class="text-xl font-semibold">
				{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
			</h2>
			<button class="btn btn-sm" onclick={() => (currentDate = new Date(currentYear, currentMonth + 1, 1))}>→</button>
		</div>

		<!-- Weekdays -->
		<div class="grid grid-cols-7 gap-1 text-center font-medium">
			<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
		</div>

		<!-- Days -->
		<div class="grid grid-cols-7 gap-1 text-center mt-2">
			{#each days() as day}
				{#if day === null}
					<div></div>
				{:else}
					{@const key = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`}
					<button
						class="cursor-pointer rounded-lg p-2 relative transition w-full h-16 flex flex-col items-center justify-start
							{day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
								? 'bg-primary text-primary-content'
								: appointments[key]
									? 'bg-yellow-200 text-black font-bold ring-2 ring-yellow-500'
									: 'bg-base-100 hover:bg-base-200 text-base-content'}"
						onclick={() => openAppointment(day)}
					>
						<span>{day}</span>
						{#if appointments[key]}
							<span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
							<div class="mt-1 text-[10px] truncate max-w-[60px] text-gray-700">
								{appointments[key]}
							</div>
						{/if}
					</button>
				{/if}
			{/each}
		</div>

		<!-- Upcoming Appointments -->
		<div class="mt-6">
			<h3 class="text-lg font-semibold mb-2">Upcoming Appointments</h3>
			{#if sortedAppointments.length > 0}
				<ul class="space-y-2">
					{#each sortedAppointments() as app}
						<li class="p-2 rounded bg-base-200">
							<strong>{app.date}</strong>: {app.note}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-500">No appointments yet.</p>
			{/if}
		</div>
	</div>
</main>

<!-- Slide Panel -->
{#if selectedDay}
	<div class="fixed inset-0 bg-black/30 flex justify-end">
		<div class="w-80 p-4 shadow-xl flex flex-col" transition:fly="{{ x: 300, duration: 250 }}">
			<h3 class="font-semibold text-lg mb-2">
				Appointment for {currentYear}-{String(currentMonth + 1).padStart(2,'0')}-{String(selectedDay).padStart(2,'0')}
			</h3>

			<textarea
				class="textarea textarea-bordered w-full flex-1"
				placeholder="Write appointment..."
				bind:value={tempNote}
			></textarea>

			<div class="flex justify-end gap-2 mt-3">
				<button class="btn btn-sm btn-outline" onclick={() => (selectedDay = null)}>Close</button>
				<button class="btn btn-sm btn-primary" onclick={saveAppointment}>Save</button>
				<button class="btn btn-sm btn-error" onclick={removeAppointment}>Remove</button>
			</div>
		</div>
	</div>
{/if}

<!-- FOOTER (untouched) -->
