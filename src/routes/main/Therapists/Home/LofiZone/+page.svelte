<script lang="ts">
	import { Menu, Search, Bell, Sun, Moon, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Music } from "lucide-svelte";

	let isPlaying = $state(false);
	let currentTrack = $state(0);
	let audio: HTMLAudioElement;
	let volume = $state(0.5);
	let quoteIndex = $state(0);
	let currentMood = $state("Forest");

	const playlist = [
		{ title: "Forest", src: "/src/lib/assets/songs/forest.mp3" },
		{ title: "Sunset", src: "/src/lib/assets/songs/sunset.mp3" },
		{ title: "Moonlight", src: "/src/lib/assets/songs/moonlight.mp3" }
	];

	const quotes = [
		"Take a deep breath. You are exactly where you need to be.",
		"Peace begins with a smile.",
		"Focus on the present moment.",
		"Let the music guide your mind."
	];

	$effect(() => {
		if (audio) {
			audio.volume = volume;
			if (isPlaying) audio.play();
			else audio.pause();
		}
	});

	function togglePlay() {
		if (!audio) return;
		if (isPlaying) audio.pause();
		else audio.play();
		isPlaying = !isPlaying;
	}

	function playTrack(index: number) {
		if (!audio) return;
		currentTrack = index;
		audio.src = playlist[currentTrack].src;
		audio.play();
		isPlaying = true;
	}

	function nextTrack() {
		currentTrack = (currentTrack + 1) % playlist.length;
		playTrack(currentTrack);
	}

	function prevTrack() {
		currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
		playTrack(currentTrack);
	}

	function changeVolume(e: Event) {
		const target = e.target as HTMLInputElement | null;
		if (!target) return;
		volume = parseFloat(target.value);
		if (audio) audio.volume = volume;
	}

	const quoteInterval = setInterval(() => {
		quoteIndex = (quoteIndex + 1) % quotes.length;
	}, 10000);
</script>

<main class="flex flex-col items-center justify-center min-h-screen text-white text-center relative overflow-hidden bg-base-200 p-6">
	<h1 class="text-4xl font-bold mb-6 animate-bounce">🌿 Lofi Zone</h1>

	<div class="player bg-base-300 bg-opacity-60 backdrop-blur-md p-8 rounded-2xl flex flex-col items-center gap-4 shadow-xl">
		<p class="opacity-80">Relax and chill to some lofi beats.</p>

		<div class="flex items-center gap-3">
			<button class="btn btn-circle btn-primary" onclick={prevTrack}><SkipBack /></button>

			<button class="btn btn-circle btn-accent" onclick={togglePlay}>
				{#if isPlaying}
					<Pause class="w-6 h-6" />
				{:else}
					<Play class="w-6 h-6" />
				{/if}
			</button>

			<button class="btn btn-circle btn-primary" onclick={nextTrack}><SkipForward /></button>

			<div class="flex items-center gap-2 ml-4">
				{#if volume > 0}
					<Volume2 class="w-5 h-5" />
				{:else}
					<VolumeX class="w-5 h-5" />
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
			{#each playlist as track, i}
				<button
					class="btn btn-sm w-full justify-start mb-2 {currentTrack === i ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => playTrack(i)}
				>
					<Music class="w-4 h-4 mr-2" /> {i + 1}. {track.title}
				</button>
			{/each}
		</div>

		<audio bind:this={audio} src={playlist[currentTrack].src}></audio>

		<div class="quote italic text-sm opacity-90 mt-3">{quotes[quoteIndex]}</div>
	</div>
</main>