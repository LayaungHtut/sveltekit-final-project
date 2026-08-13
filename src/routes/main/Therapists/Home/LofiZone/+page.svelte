<script lang="ts">
	import { SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Music } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let audio: HTMLAudioElement;
	let isPlaying = $state(false);
	let currentTrack = $state(0);
	let volume = $state(0.5);
	let quoteIndex = $state(0);

	// Swap these for your own files (drop them in static/songs/).
	const playlist = [
		{ title: 'Forest', src: '/songs/forest.mp3' },
		{ title: 'Sunset', src: '/songs/sunset.mp3' },
		{ title: 'Moonlight', src: '/songs/moonlight.mp3' }
	];

	const quotes = [
		'Take a deep breath. You are exactly where you need to be.',
		'Peace begins with a smile.',
		'Focus on the present moment.',
		'Let the music guide your mind.'
	];

	const STORAGE_KEY = 'serenity-lofi-settings';

	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (typeof parsed.track === 'number' && parsed.track < playlist.length) {
					currentTrack = parsed.track;
				}
				if (typeof parsed.volume === 'number') {
					volume = Math.min(1, Math.max(0, parsed.volume));
				}
			} catch {
				// ignore corrupted storage
			}
		}

		const timer = setInterval(() => {
			quoteIndex = (quoteIndex + 1) % quotes.length;
		}, 10000);

		return () => clearInterval(timer);
	});

	$effect(() => {
		if (!audio) return;
		audio.volume = volume;
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ track: currentTrack, volume }));
	});

	function togglePlay() {
		if (!audio) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
	}

	function playTrack(index: number) {
		if (!audio) return;
		currentTrack = index;
		audio.src = playlist[index].src;
		audio.play();
	}

	function nextTrack() {
		playTrack((currentTrack + 1) % playlist.length);
	}

	function prevTrack() {
		playTrack((currentTrack - 1 + playlist.length) % playlist.length);
	}

	function changeVolume(e: Event) {
		const target = e.target as HTMLInputElement | null;
		if (!target) return;
		volume = parseFloat(target.value);
	}
</script>

<main
	class="bg-base-200 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-center text-white"
>
	<h1 class="mb-6 animate-bounce text-4xl font-bold">🌿 Lofi Zone</h1>

	<div
		class="player bg-base-300 bg-opacity-60 flex flex-col items-center gap-4 rounded-2xl p-8 shadow-xl backdrop-blur-md"
	>
		<p class="opacity-80">Relax and chill to some lofi beats.</p>

		<div class="flex items-center gap-3">
			<button class="btn btn-circle btn-primary" onclick={prevTrack}><SkipBack /></button>

			<button class="btn btn-circle btn-accent" onclick={togglePlay}>
				{#if isPlaying}
					<Pause class="h-6 w-6" />
				{:else}
					<Play class="h-6 w-6" />
				{/if}
			</button>

			<button class="btn btn-circle btn-primary" onclick={nextTrack}><SkipForward /></button>

			<div class="ml-4 flex items-center gap-2">
				{#if volume > 0}
					<Volume2 class="h-5 w-5" />
				{:else}
					<VolumeX class="h-5 w-5" />
				{/if}
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={volume}
					oninput={changeVolume}
					class="range range-xs range-accent w-32"
				/>
			</div>
		</div>

		<div class="playlist w-full max-w-xs">
			{#each playlist as track, i (track.title)}
				<button
					class="btn btn-sm mb-2 w-full justify-start {currentTrack === i
						? 'btn-primary'
						: 'btn-ghost'}"
					onclick={() => playTrack(i)}
				>
					<Music class="mr-2 h-4 w-4" />
					{i + 1}. {track.title}
				</button>
			{/each}
		</div>

		<audio
			bind:this={audio}
			src={playlist[currentTrack].src}
			onplay={() => (isPlaying = true)}
			onpause={() => (isPlaying = false)}
			onended={nextTrack}
		></audio>

		<div class="quote mt-3 text-sm italic opacity-90">{quotes[quoteIndex]}</div>
	</div>
</main>
