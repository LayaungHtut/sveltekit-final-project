<script lang="ts">
	import { Book, FileText, MessageCircle, CheckSquare, BarChart2, Notebook } from "lucide-svelte";

		let { data } = $props();

	const cards = [
		{
			title: "Messages",
			icon: MessageCircle,
			link: "/main/Therapists/Chats",
			image: "/src/lib/assets/images/blue-background-with-message-heart_405287-81.avif"
		},
		{
			title: "Notes",
			icon: Notebook,
			link: "/main/Therapists/notes",
			image: "/src/lib/assets/images/notes.jpg"
		},
		{
			title: "Resources",
			icon: Book,
			link: "/main/Therapists/Dashboard/Resources",
			image: "/src/lib/assets/images/pexels-pixabay-159751.jpg"
		},
		{
			title: "Articles",
			icon: FileText,
			link: "/main/mainComponents/Articles",
			image: "/src/lib/assets/images/article-71342_1920.jpg"
		}
	];
</script>

<div class="p-6">
	<h1 class="text-3xl font-bold mb-6">
		Welcome back, {data.user?.username}! 🌿
	</h1>

	<!-- Dashboard grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
		{#each cards as card}
			<a
				href={card.link}
				class="relative block h-48 rounded-xl overflow-hidden shadow-lg group transition-transform hover:scale-105"
			>
				<img
					src={card.image}
					alt={card.title}
					class="absolute inset-0 h-full w-full object-cover opacity-70"
				/>

				<!-- Overlay -->
				<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
					<svelte:component this={card.icon} class="w-8 h-8 text-white mb-2" />
					<h3 class="text-lg font-bold text-white">{card.title}</h3>
				</div>
			</a>
		{/each}
	</div>
</div>
