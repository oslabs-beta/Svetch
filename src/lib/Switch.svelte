<script>
  export let checked = false;
</script>

<div id = 'switchCont'>
  <h1 id="CandT">Tree/Canvas</h1>
  <label class="switch">
    <input type="checkbox" bind:checked />
    <span class="slider" />
  </label>
</div>

<style>
  #switchCont{
    align-items: center;
  }
  .switch {
    position: relative;
    width: 36px;
    height: 20px;
  }
  label {
    margin: 0 auto;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 17px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #836e60;
  }
  input:checked + .slider {
    box-shadow: 0 0 1px #836e60;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }
  #CandT{
    font-size: xx-small;
  }
</style>