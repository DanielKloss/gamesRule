<script>
    export let game;
</script>

<div class="container">
  <div class="summary">
    {#each game.ruleSummaries as rule}
      <div class="bullet">{rule.ruleSummaryText}</div>
    {/each}
  </div>

  <div class="rules">
    {#each game.rules as rule}
      <div class="ruleHeader">{rule.title}</div>
      <div class="rule">{rule.ruleText}</div>
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: var(--medium);
    line-height: 1.75rem;
		border-radius: var(--radiusLarge);
		padding: 2rem;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .summary{
    text-align: center;
    margin-bottom: 2rem;
  }

  .summary .bullet::before {
    content: "\25B0";
    color: var(--primary);
    display: inline-block;
    width: 1em;
    margin-right: 0.25em;
  }

  .ruleHeader{
    background: var(--primary);
    border-radius: var(--radiusLarge);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		padding: 1rem;
    font-size: var(--large);
    font-weight: bold;
  }

  .rule{
    margin: 1rem 1rem 2rem 1rem;
    text-align: center;
  }
</style>