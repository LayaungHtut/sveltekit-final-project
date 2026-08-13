<script lang="ts">
	import { enhance } from '$app/forms';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props<{
		appointments: Record<string, string>;
		user: { id: string; username: string; role: string };
	}>();

	// svelte-ignore state_referenced_locally (snapshot server data into mutable local state)
	let appointments = $state<Record<string, string>>(data.appointments);

	// Current date
	let currentDate = $state(new Date());
	let currentMonth = $derived(currentDate.getMonth());
	let currentYear = $derived(currentDate.getFullYear());

	// Slide panel state
	let selectedDay = $state<number | null>(null);
	let tempNote = $state('');

	const today = new Date();

	function dateKey(day: number): string {
		return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
	}

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
	let sortedAppointments = $derived(() =>
		Object.entries(appointments)
			.map(([date, note]) => ({ date, note }))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
	);

	// Open slide panel
	function openAppointment(day: number) {
		selectedDay = day;
		tempNote = appointments[dateKey(day)] ?? '';
	}

	function onSave() {
		if (!selectedDay) return;
		const key = dateKey(selectedDay);
		if (tempNote.trim() === '') {
			const next = { ...appointments };
			delete next[key];
			appointments = next;
		} else {
			appointments = { ...appointments, [key]: tempNote };
		}
		selectedDay = null;
	}

	function onRemove() {
		if (!selectedDay) return;
		const key = dateKey(selectedDay);
		const next = { ...appointments };
		delete next[key];
		appointments = next;
		selectedDay = null;
	}
</script>

<!-- MAIN -->
<main class="flex justify-center p-6">
	<div class="w-full max-w-3xl">
		<!-- Month controls -->
		<div class="mb-4 flex items-center justify-between">
			<button
				class="btn btn-sm"
				onclick={() => (currentDate = new Date(currentYear, currentMonth - 1, 1))}>←</button
			>
			<h2 class="text-xl font-semibold">
				{new Date(currentYear, currentMonth).toLocaleString('default', {
					month: 'long',
					year: 'numeric'
				})}
			</h2>
			<button
				class="btn btn-sm"
				onclick={() => (currentDate = new Date(currentYear, currentMonth + 1, 1))}>→</button
			>
		</div>

		<!-- Weekdays -->
		<div class="grid grid-cols-7 gap-1 text-center font-medium">
			<div>Sun</div>
			<div>Mon</div>
			<div>Tue</div>
			<div>Wed</div>
			<div>Thu</div>
			<div>Fri</div>
			<div>Sat</div>
		</div>

		<!-- Days -->
		<div class="mt-2 grid grid-cols-7 gap-1 text-center">
			{#each days() as day, i (i)}
				{#if day === null}
					<div></div>
				{:else}
					{@const key = dateKey(day)}
					<button
						class="relative flex h-16 w-full cursor-pointer flex-col items-center justify-start rounded-lg p-2 transition
							{day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
							? 'bg-primary text-primary-content'
							: appointments[key]
								? 'bg-yellow-200 font-bold text-black ring-2 ring-yellow-500 hover:bg-yellow-300'
								: 'bg-base-100 hover:bg-base-200 text-base-content'}"
						onclick={() => openAppointment(day)}
					>
						<span>{day}</span>
						{#if appointments[key]}
							<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
							<div class="mt-1 max-w-[60px] truncate text-[10px] text-gray-700">
								{appointments[key]}
							</div>
						{/if}
					</button>
				{/if}
			{/each}
		</div>

		<!-- Upcoming Appointments -->
		<div class="mt-6">
			<h3 class="mb-2 text-lg font-semibold">Upcoming Appointments</h3>
			{#if sortedAppointments().length > 0}
				<ul class="space-y-2">
					{#each sortedAppointments() as app (app.date)}
						<li class="bg-base-200 rounded p-2">
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
	{@const key = dateKey(selectedDay)}
	<div class="fixed inset-0 z-50 flex justify-end bg-black/50" transition:fade={{ duration: 150 }}>
		<div
			class="bg-base-100 border-base-300 flex w-80 flex-col border-l p-4 shadow-2xl"
			transition:fly={{ x: 300, duration: 250 }}
		>
			<h3 class="mb-2 text-lg font-semibold">
				Appointment for {currentYear}-{String(currentMonth + 1).padStart(2, '0')}-{String(
					selectedDay
				).padStart(2, '0')}
			</h3>

			<textarea
				class="textarea textarea-bordered w-full flex-1"
				placeholder="Write appointment..."
				bind:value={tempNote}
			></textarea>

			<div class="mt-3 flex justify-end gap-2">
				<button class="btn btn-sm btn-outline" onclick={() => (selectedDay = null)}>Close</button>
				{#if appointments[key]}
					<form
						method="POST"
						action="?/deleteAppointment"
						use:enhance={() => {
							onRemove();
							return async () => {};
						}}
					>
						<input type="hidden" name="date" value={key} />
						<button type="submit" class="btn btn-sm btn-error">Remove</button>
					</form>
				{/if}
				<form
					method="POST"
					action="?/saveAppointment"
					use:enhance={() => {
						onSave();
						return async () => {};
					}}
				>
					<input type="hidden" name="date" value={key} />
					<input type="hidden" name="note" value={tempNote} />
					<button type="submit" class="btn btn-sm btn-primary" disabled={!tempNote.trim()}
						>Save</button
					>
				</form>
			</div>
		</div>
	</div>
{/if}
