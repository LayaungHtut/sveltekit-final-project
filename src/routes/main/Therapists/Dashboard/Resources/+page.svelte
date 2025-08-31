<script>
	import { BookOpen, FileText, PlayCircle, Mic } from 'lucide-svelte';
</script>

<div class="bg-base-100 min-h-screen flex-1 overflow-y-auto p-8">
	<!-- Page Header -->
	<section class="mb-10 text-left">
		<h1 class="text-primary text-4xl font-bold">Therapy Resources</h1>
		<p class="text-base-content/70 mt-2 text-lg">
			Curated guides, tools, and exercises to support your wellbeing
		</p>
	</section>

	<!-- Resource Cards Grid -->
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Articles Card -->
		<div class="card bg-base-100 shadow-xl transition hover:shadow-2xl">
			<figure class="h-48">
				<img
					src="/src/lib/assets/images/vail.jpg"
					alt="Articles"
					class="h-full w-full object-cover"
				/>
			</figure>
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<BookOpen class="h-5 w-5" /> Articles
				</h2>
				<p>Living with Purpose: A Key to Longevity.</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary"
						><a
							href="https://www.vailhealthbh.org/about/news/living-with-purpose-a-key-to-longevity?gad_source=1&gad_campaignid=22585211192&gbraid=0AAAAACnR5I-dQhPqU-RJTsIPk0WIGUev1&gclid=Cj0KCQjw5c_FBhDJARIsAIcmHK-_m9KkVdQ4eXk0RnCpkNVwnNxHLPNYMAmnd2r2oZ2aHl6yHnawdCwaAlPVEALw_wcB"
						>
							Browse</a
						></button
					>
				</div>
			</div>
		</div>

		<!-- Worksheets Card -->
		<div class="card bg-base-100 shadow-xl transition hover:shadow-2xl">
			<figure class="h-48">
				<img
					src="/src/lib/assets/images/snow.jpg"
					alt="Worksheets"
					class="h-full w-full object-cover"
				/>
			</figure>
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<FileText class="h-5 w-5" /> PDF
				</h2>
				<p>
					Mindfulness is a technique you can learn which involves noticing what's happening in the
					present moment, without judgement.
				</p>
				<div class="card-actions justify-end">
					<a href="/src/lib/assets/mindfulness-2021.pdf" download class="btn btn-primary">
						Download
					</a>
				</div>
			</div>
		</div>

		<!-- Podcasts Card -->
		<div class="card bg-base-100 shadow-xl transition hover:shadow-2xl">
			<figure class="h-48">
				<img
					src="/src/lib/assets/images/linda.jpg"
					alt="Videos"
					class="h-full w-full object-cover"
				/>
			</figure>
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<PlayCircle class="h-5 w-5" /> Podcasts
				</h2>
				<p>Linda’s Corner Podcast: Inspiration for a Better Life .</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary"
						><a
							href="https://hopeforhealingfoundation.org/lindas-corner-podcast/?gad_source=1&gad_campaignid=20580693029&gbraid=0AAAAAC3JL8ViMNk4pMoNJKqvfRyUkrOTL&gclid=Cj0KCQjw5c_FBhDJARIsAIcmHK9qTIzriexaQV-nhITJrg4sy9w_QdDxprENOQ1Scv1Vg5-VD3TjwfQaAhZhEALw_wcB"
							target="_blank"
						>
							Listen</a
						></button
					>
				</div>
			</div>
		</div>

		<!-- Videos Card -->
		<div class="card bg-base-100 shadow-xl transition hover:shadow-2xl">
			<figure class="h-48">
				<img
					src="/src/lib/assets/images/podcast.jpg"
					alt="Podcasts"
					class="h-full w-full object-cover"
				/>
			</figure>
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<Mic class="h-5 w-5" /> Video Podcasts
				</h2>
				<p>Conversations of Mark Manson and stories to inspire and educate.</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary"
						><a
							href="https://youtube.com/playlist?list=PLkkA1LPpvlkjbuctKTaViIeIiZljzbqxW&si=xArXW3MLi-rxKuq4"
							target="_blank">Watch</a
						></button
					>
				</div>
			</div>
		</div>
	</div>
	<!-- Featured Resource -->
	<section class="card bg-base-100 lg:card-side mt-14 shadow-xl">
		<figure class="h-64 w-full lg:w-1/2">
			<img
				src="/src/lib/assets/images/mindfulness.jpg"
				alt="Featured Resource"
				class="h-full w-full rounded-xl object-cover"
			/>
		</figure>
		<div class="card-body">
			<h2 class="card-title">📌 Featured Resource</h2>
			<p class="text-lg">
				“The Beginner’s Guide to Mindfulness” – A simple, step-by-step introduction to living in the
				present moment.
			</p>
			<div class="card-actions">
				<a
					href="https://mindfulness.com/mindful-living/mindfulness-a-beginners-guide"
					class="btn btn-primary">Read More</a
				>
			</div>
		</div>
	</section>
</div>
