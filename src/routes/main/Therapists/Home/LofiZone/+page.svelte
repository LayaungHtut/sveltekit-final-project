<script lang="ts">
	let isPlaying = $state(false);
	let currentTrack = $state(0);
	let audio: HTMLAudioElement;
	let volume = $state(0.5);
	let quoteIndex = $state(0);
	let currentMood = $state('Forest');

	const playlist = [
		{ title: 'Forest', src: '/src/lib/assets/audios/forest.mp3' },
		{ title: 'Sunset', src: '/src/lib/assets/audios/sunset.mp3' },
		{ title: 'Moonlight', src: '/src/lib/assets/audios/moonlight.mp3' }
	];

	const quotes = [
		'Take a deep breath. You are exactly where you need to be.',
		'Peace begins with a smile.',
		'Focus on the present moment.',
		'Let the music guide your mind.'
	];

	const moods = [
		{ name: 'Forest', bg: 'linear-gradient(to bottom, #60885e, #a0b89a)' },
		{ name: 'Sunset', bg: 'linear-gradient(to bottom, #ff7e5f, #feb47b)' },
		{ name: 'Night', bg: 'linear-gradient(to bottom, #2c3e50, #4ca1af)' }
	];

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

	function changeMood(mood: string, bg: string) {
		currentMood = mood;
		document.body.style.background = bg;
	}

	const quoteInterval = setInterval(() => {
		quoteIndex = (quoteIndex + 1) % quotes.length;
	}, 10000);

	$effect(() => {
		if (audio) audio.volume = volume;
	});
</script>


<main>
	<h1>🌿 Lofi Zone</h1>

	<div class="player">
		<p>Relax and chill to some lofi beats.</p>

		<div class="controls">
			<button onclick={prevTrack}>⏮️</button>
			<button onclick={togglePlay}>{isPlaying ? '⏸️' : '▶️'}</button>
			<button onclick={nextTrack}>⏭️</button>
			<input type="range" min="0" max="1" step="0.01" bind:value={volume} oninput={changeVolume} />
		</div>

		<div class="playlist">
			{#each playlist as track, i}
				<button class={currentTrack === i ? 'current' : ''} onclick={() => playTrack(i)}>
					{i + 1}. {track.title}
				</button>
			{/each}
		</div>

		<audio bind:this={audio} src={playlist[currentTrack].src}></audio>

		<div class="quote">{quotes[quoteIndex]}</div>

		<div class="moods">
			{#each moods as mood}
				<button onclick={() => changeMood(mood.name, mood.bg)}>{mood.name}</button>
			{/each}
		</div>
	</div>

	<!-- Forest theme -->
	{#if currentMood === 'Forest'}
		{#each Array(10) as _, i}
			<div class="leaf" style="--i:{i}"></div>
		{/each}
		{#each Array(3) as _, i}
			<div class="tree" style="--i:{i}"></div>
		{/each}
		<div class="deer"></div>
	{/if}

	<!-- Sunset theme -->
	{#if currentMood === 'Sunset'}
		<div class="sun"></div>
		{#each Array(5) as _, i}
			<div class="cloud" style="--i:{i}"></div>
		{/each}
	{/if}

	<!-- Night theme -->
	{#if currentMood === 'Night'}
		<div class="moon"></div>
		{#each Array(20) as _, i}
			<div class="star" style="--i:{i}"></div>
		{/each}
	{/if}
</main>



<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		text-align: center;
		position: relative;
		overflow: hidden;
        color: white;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 20px;
		animation: float 4s ease-in-out infinite;
		color: white;
	}

	.player {
		background: rgba(0, 0, 0, 0.2);
		padding: 40px;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		z-index: 2;
		position: relative;
	}

	.controls button {
		background: white;
		color: #60885e;
		border: none;
		padding: 10px 15px;
		margin: 0 5px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		transition: 0.2s;
	}
	.controls button:hover {
		background: #d9e3d5;
	}
	.controls input[type='range'] {
		margin-left: 10px;
	}

	.playlist {
		margin-top: 15px;
		text-align: left;
		max-width: 200px;
		width: 100%;
	}
	.playlist button {
		display: flex;
		cursor: pointer;
		padding: 5px;
		border-radius: 5px;
		transition: 0.2s;
	}
	.playlist button.current {
		background: #60885e;
		font-weight: bold;
		color: white;
	}

	.quote {
		margin-top: 20px;
		font-style: italic;
		max-width: 300px;
		color: #fff;
	}

	.moods button {
		margin: 5px;
		padding: 5px 10px;
		border-radius: 8px;
		cursor: pointer;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		font-weight: bold;
	}

	/* Floating animations */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	/* Forest elements */
	.leaf {
		position: absolute;
		width: 20px;
		height: 20px;
		background: url('$lib/assets/images/leaf.jpg') no-repeat center/contain;
		top: -50px;
		left: calc(var(--i) * 10%);
		animation: floatLeaf calc(10s + var(--i) s) linear infinite;
		z-index: 1;
		opacity: 0.8;
		transition: opacity 1s;
	}
	@keyframes floatLeaf {
		0% {
			transform: translateY(0) rotate(0deg);
		}
		100% {
			transform: translateY(600px) rotate(360deg);
		}
	}

	.tree {
		position: absolute;
		width: 80px;
		height: 120px;
		background: url('/tree.png') no-repeat center/contain;
		bottom: 0;
		left: calc(var(--i) * 25%);
		opacity: 0.9;
		transition: opacity 1s;
	}

	.deer {
		position: absolute;
		width: 60px;
		height: 40px;
		background: url('/') no-repeat center/contain;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		opacity: 0.9;
		transition: opacity 1s;
	}

	/* Sunset */
	.sun {
		position: absolute;
		width: 100px;
		height: 100px;
		background: yellow;
		border-radius: 50%;
		top: 50px;
		right: 50px;
		box-shadow: 0 0 60px 20px rgba(255, 223, 0, 0.5);
		transition: opacity 1s;
	}
	.cloud {
		position: absolute;
		width: 80px;
		height: 40px;
		/* background: rgba(255, 255, 255, 0.7); */
		border-radius: 40px;
		top: calc(30px + var(--i) * 30px);
		left: calc(-100px - var(--i) * 50px);
		animation: floatCloud calc(20s + var(--i) s) linear infinite;
		transition: opacity 1s;
	}
	@keyframes floatCloud {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(1200px);
		}
	}

	/* Night */
	.moon {
		position: absolute;
		width: 80px;
		height: 80px;
		/* background: #f5f3ce; */
		border-radius: 50%;
		top: 50px;
		right: 50px;
		box-shadow: 0 0 40px 10px rgba(245, 243, 206, 0.5);
		transition: opacity 1s;
	}
	.star {
		position: absolute;
		width: 3px;
		height: 3px;
		/* background: white; */
		border-radius: 50%;
		top: calc(var(--i) * 5%);
		left: calc(var(--i) * 6%);
		animation: twinkle 3s infinite alternate;
		transition: opacity 1s;
	}
	@keyframes twinkle {
		0% {
			opacity: 0.2;
		}
		100% {
			opacity: 1;
		}
	}
</style>
