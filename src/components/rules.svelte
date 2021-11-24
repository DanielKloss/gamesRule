<script>
    export let activeGame;
</script>
  
 <ul class="summary">
  {#each activeGame.ruleSummaries as rule}
    <li>{rule.ruleSummaryText}</li>
  {/each}
</ul>

<ul class="rules">
  {#each activeGame.rules as rule}
    <h1 class="ruleHeader">{rule.title}</h1>
    <p class="rule">{rule.ruleText}</p>
  {/each}
</ul> 

<style>
  .summary{
    list-style: none;
    text-align: center;
    line-height: 1.75rem;
    margin: 2rem auto;
    width: 75%;
    max-width: 700px;
    padding: 0;
  }

  .summary li::before {
    content: "\25B0";
    color: var(--primary);
    display: inline-block;
    width: 1em;
    margin-right: 0.25em;
  }

  .rules{
    margin: 2rem auto;
    width: 75%;
    line-height: 1.75rem;
    padding: 0;
    max-width: 700px;
  }

  .ruleHeader{
    font-weight: bold;
    font-size: 1.25rem;
    margin-bottom: 0.2rem;

    background: var(--primary);
    padding: 0.5rem 0rem 0.5rem 1rem;
		transform: skewX(-10deg);
  }

  .rule{
    margin-top: 0.2rem;

  }
</style>