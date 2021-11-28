<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let tabs;
    export let activeTab;
</script>

<div class="tabs">
  <ul>
      {#each tabs as tab}
          <li on:click={() => dispatch('tabChange', tab.name)}>
              <div class:active={tab.name===activeTab}>{tab.name}</div>
          </li>
      {/each}
  </ul>

  {#each tabs as tab}
      {#if activeTab === tab.name}
          <svelte:component this={tab.component} {...tab.props} on:filtersChanged={(e) => dispatch('filtersChanged', e)}/>
      {/if}
  {/each}
</div>

<style>
  .tabs {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
  }

  ul {
    display: flex;
    justify-content: center;
    padding: 0;
    list-style-type: none;
  }

  li {
    margin: 0 1rem;
    font-size: 1.3rem;
    color: #555;
    cursor: pointer;
  }

  .active {
    color: #000;
    border-bottom-width: 3px;
    border-bottom-style: solid;
    border-bottom-color: var(--primary);
    padding-bottom: 0.2rem;
  }
</style>