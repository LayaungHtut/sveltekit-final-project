<script lang="ts">
	import { Book, FileText, MessageCircle, Notebook } from 'lucide-svelte';
	import messagesImage from '$lib/assets/images/blue-background-with-message-heart_405287-81.avif';
	import notesImage from '$lib/assets/images/notes.jpg';
	import resourcesImage from '$lib/assets/images/pexels-pixabay-159751.jpg';
	import articlesImage from '$lib/assets/images/article-71342_1920.jpg';

	let { data } = $props();

	const cards = [
		{
			title: 'Messages',
			icon: MessageCircle,
			link: '/main/Therapists/Chats',
			image: messagesImage
		},
		{
			title: 'Notes',
			icon: Notebook,
			link: '/main/Therapists/notes',
			image: notesImage
		},
		{
			title: 'Resources',
			icon: Book,
			link: '/main/Therapists/Dashboard/Resources',
			image: resourcesImage
		},
		{
			title: 'Articles',
			icon: FileText,
			link: '/main/mainComponents/Articles',
			image: articlesImage
		}
	];
</script>

<div class="p-6">
	<h1 class="mb-6 text-3xl font-bold">
		Welcome back, {data.user?.username}! 🌿
	</h1>

	<!-- Dashboard grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
		{#each cards as card (card.title)}
			{@const Icon = card.icon}
			<a
				href={card.link}
				class="group relative block h-48 overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105"
			>
				<img
					src={card.image}
					alt={card.title}
					class="absolute inset-0 h-full w-full object-cover opacity-70"
				/>

				<!-- Overlay -->
				<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
					<Icon class="mb-2 h-8 w-8 text-white" />
					<h3 class="text-lg font-bold text-white">{card.title}</h3>
				</div>
			</a>
		{/each}
	</div>
</div>
