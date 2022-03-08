<script context="module">
  export async function load ({ fetch }){
		try {
			const gamesResult = await fetch('/api/games');
			const gamesBody = await gamesResult.json();
			const games = gamesBody.games;

			const categoriesResult = await fetch('/api/games?type=categories');
			const categoriesBody = await categoriesResult.json();
			const categories = categoriesBody.categories;

			const mechanicsResult = await fetch('/api/games?type=mechanics');
			const mechanicsBody = await mechanicsResult.json();
			const mechanics = mechanicsBody.mechanics;

			return {
				stuff: { games, categories, mechanics }
			};
		} catch (error) {
			console.log(error);
		}
	}
</script>

<main>
    <slot></slot>
</main>

<style>
    main{
		width: 80%;
		margin: 0 auto;
		margin-top: 1rem;
	}
</style>