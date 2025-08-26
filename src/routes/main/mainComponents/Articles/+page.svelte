<script lang="ts">
	// Articles with short + full text
	let articles = [
		{
			title: 'Site History',
			preview: 'Founded in 2025 by students who wanted to create a safe mental health space...',
			full: `This therapy site was founded in 2025 by a group of students who often felt overlooked in society. Their shared experiences of struggling in silence inspired them to create a platform where people could find guidance, understanding, and mental health support without fear of judgment. What began as a student-led initiative has quickly grown into a supportive community that bridges the gap between professional resources and everyday people seeking a safe space.`
		},
		{
			title: 'Objectives',
			preview:
				'The site’s objectives are to make mental health knowledge accessible and fight stigma...',
			full: `The main objectives of the site are to make mental health knowledge accessible, fight stigma, and encourage people to care for their well-being. It aims to guide those who are unsure about therapy, offering clear explanations and relatable stories. At the same time, it gives young voices a platform to share ideas and connect with experts, showing that students, too, can lead positive change in mental health awareness.`
		},
		{
			title: 'Therapy Trends',
			preview: 'In 2025, therapy is shifting toward accessibility and personalization...',
			full: `In 2025, therapy is shifting more than ever toward accessibility and personalization. Online therapy has become a normal choice for many, allowing sessions to happen anywhere. Students and young professionals are drawn to mindfulness and meditation practices to manage stress in fast-paced lives. Cognitive-behavioral therapy remains a core approach, but there’s also a growing focus on blending technology with traditional therapy—such as mobile apps, AI chat support, and virtual group sessions.`
		},
		{
			title: 'Famous Therapists',
			preview:
				'This platform builds on foundations laid by pioneers like Freud, Jung, Rogers, and Beck...',
			full: `While this platform is student-driven, it builds on the foundation laid by pioneers in the field. Sigmund Freud’s exploration of the unconscious, Carl Jung’s insights on archetypes, Carl Rogers’ humanistic approach, and Aaron Beck’s development of cognitive therapy continue to influence mental health care. Their ideas provide the base upon which today’s students and future therapists can innovate, adapt, and respond to the challenges of modern society.`
		},
		{
			title: 'Thesis',
			preview:
				'Recent studies stress that therapy must be both evidence-based and culturally sensitive...',
			full: `Recent studies stress that therapy is most effective when it’s both evidence-based and culturally sensitive. For students founding this site, the thesis is clear: therapy must evolve to reflect the needs of overlooked communities, including youth who often feel unseen. By integrating holistic practices—balancing mental, emotional, and social well-being—the platform promotes a vision of care that is inclusive, innovative, and centered on real human experience.`
		}
	];

	// Track which article is expanded
let expanded: Record<number, boolean> = {};
</script>

	

<div class="main" style="background-color: #60885E;">
	<!-- NAVBAR -->
	<!-- Navbar remains the same -->
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h7"
						/>
					</svg>
				</div>
				<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
					<li><a href="/">Homepage</a></li>
					<li><a href="/">Dashboard</a></li>
					<li><a href="/">Chats</a></li>
					<li><a href="/">Notes</a></li>
					<li><a href="/">Calendar</a></li>
				</ul>
			</div>
		</div>
		<div class="navbar-center">
			<a
				href="/"
				class="btn btn-ghost text-xl"
				style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;"
				>MindSpace</a
			>
		</div>
		<div class="navbar-end">
			<button aria-label="Search" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
			<button aria-label="Notifications" class="btn btn-ghost btn-circle">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<span class="badge badge-xs badge-primary indicator-item"></span>
				</div>
			</button>

			<label class="swap swap-rotate">
				<!-- this hidden checkbox controls the state -->
				<input type="checkbox" class="theme-controller" value="synthwave" />

				<!-- sun icon -->
				<svg
					class="swap-off h-10 w-10 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
					/>
				</svg>

				<!-- moon icon -->
				<svg
					class="swap-on h-10 w-10 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
					/>
				</svg>
			</label>
		</div>
	</div>

	<!-- ARTICLES -->
	<div class="articles-container">
		<h1>Therapy Articles</h1>
		<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
			{#each articles as article, i}
				<div class="card rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg">
					<h2>{article.title}</h2>
					<p>
						{#if expanded[i]}
							{article.full}
						{:else}
							{article.preview}
						{/if}
					</p>
					<button
						class="btn mt-3"
						style="background-color:#60885E; color:white;"
						on:click={() => (expanded[i] = !expanded[i])}
					>
						{expanded[i] ? 'Read Less' : 'Read More'}
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- FOOTER -->
	<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-2">
		<aside>
			<p>Copyright © {new Date().getFullYear()} - All rights reserved by MindSpace UIT</p>
		</aside>
	</footer>
</div>

<style>
	:root {
		background-color: #f9f9f9;
	}

	.articles-container {
		max-width: 1100px;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #f9f9f9;
		border-radius: 12px;
	}

	h1 {
		text-align: center;
		color: #60885e;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	h2 {
		color: #60885e;
		font-size: 1.4rem;
		margin-bottom: 0.5rem;
	}
</style>
