<script lang="ts">
	let today = new Date();
	let currentMonth = $state(today.getMonth());
	let currentYear = $state(today.getFullYear());

	const months = [
		'January','February','March','April','May','June',
		'July','August','September','October','November','December'
	];

	let days: (number | null)[] = $state([]);
	let appointments = $state<{ [key: string]: string }>({});

	let selectedDay = $state('');
	let showAppointment = $state(false);
	let newAppointment = $state('');

	function formatDate(y: number, m: number, d: number) {
		return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
	}

	function renderCalendar(month: number, year: number) {
		const temp: (number | null)[] = [];
		const firstDay = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();

		for (let i = 0; i < firstDay; i++) temp.push(null);
		for (let i = 1; i <= totalDays; i++) temp.push(i);
		days = temp;
	}

	function prevMonth() {
		currentMonth--;
		if (currentMonth < 0) {
			currentMonth = 11;
			currentYear--;
		}
		renderCalendar(currentMonth, currentYear);
	}

	function nextMonth() {
		currentMonth++;
		if (currentMonth > 11) {
			currentMonth = 0;
			currentYear++;
		}
		renderCalendar(currentMonth, currentYear);
	}

	function openAppointment(day: number) {
		selectedDay = formatDate(currentYear, currentMonth, day);
		newAppointment = appointments[selectedDay] || '';
		showAppointment = true;
	}

	function saveAppointment() {
		if (newAppointment.trim()) {
			appointments[selectedDay] = newAppointment.trim();
			triggerNotification(selectedDay, newAppointment);
		} else {
			delete appointments[selectedDay];
		}
		showAppointment = false;
	}

	function triggerNotification(date: string, text: string) {
		if (!('Notification' in window)) return;
		if (Notification.permission === 'granted') {
			new Notification(`Appointment on ${date}`, { body: text });
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					new Notification(`Appointment on ${date}`, { body: text });
				}
			});
		}
	}

	$effect(() => {
		renderCalendar(currentMonth, currentYear);
	});
</script>

<!-- Calendar Section -->
<div class="flex justify-center py-10">
	<div class="calendar-container bg-base-100 border border-base-200 rounded-lg p-6 shadow-xl">
		<div class="calendar-header mb-4 flex items-center justify-between">
			<button class="btn btn-sm btn-outline btn-primary" onclick={prevMonth}>&lt;</button>
			<h2 class="text-lg font-semibold">{months[currentMonth]} {currentYear}</h2>
			<button class="btn btn-sm btn-outline btn-primary" onclick={nextMonth}>&gt;</button>
		</div>

		<div class="grid grid-cols-7 text-center font-semibold text-base-content mb-2">
			<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
			<div>Thu</div><div>Fri</div><div>Sat</div>
		</div>

		<div class="days grid grid-cols-7 gap-1 text-center">
			{#each days as day}
				{#if day === null}
					<div></div>
				{:else}
					<button
						class="relative p-2 rounded-lg transition
							{day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
								? 'bg-primary text-primary-content ring-2 ring-offset-2 ring-primary'
								: 'hover:bg-base-200 bg-base-100 text-base-content'}"
						onclick={() => openAppointment(day)}
					>
						{day}
						{#if appointments[formatDate(currentYear, currentMonth, day)]}
							<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-error"></span>
						{/if}
					</button>
				{/if}
			{/each}
		</div>
	</div>
</div>

<!-- Appointment Modal -->
{#if showAppointment}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg mb-2">Appointment on {selectedDay}</h3>
			<textarea
				class="textarea textarea-bordered w-full"
				rows="3"
				bind:value={newAppointment}
				placeholder="Enter appointment reminder..."
			></textarea>
			<div class="modal-action">
				<button class="btn btn-ghost" onclick={() => (showAppointment = false)}>Cancel</button>
				<button class="btn btn-primary" onclick={saveAppointment}>Save</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.calendar-container {
		width: 360px;
	}
</style>
