<script>
  export let score;
  export let maxScore;
  export let minScore;
  export let imageRoot;

  $: imageSource = imageRoot + score + ".svg";
</script>

<div class="slidecontainer">
  <img src={imageSource} alt={imageSource}/>
  <input steps="1" type="range" min={minScore} max={maxScore} bind:value={score} class="slider">
</div>

<style>
  img{
      width: 100%;
  }

  .slidecontainer {
    display: flex;
    flex-direction: column;
  }

  .slider {
    -webkit-appearance: slider-vertical;
    width: 50%;
    margin: 0 auto;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 25px;
    height: 25px;
    background: purple;
    cursor: pointer;
  } 
</style>