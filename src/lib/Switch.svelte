<script>
  export let checked = false;
</script>

<style>
.switchContainer {
  position: absolute;
  right: 40px;
  width: 30px;
  height: 17px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  top: 15px;
}
.switch {
  display: inline-block;
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
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2196f3;
}
input:checked + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  -webkit-transform: translateX(13px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}
.toggleLabel {
  font-size: xx-small;
  margin-bottom: 0.5rem;
}
</style>
<div class="switchContainer">
  <h1 class="toggleLabel">Tree/Canvas</h1>
  <div class="switch">
    <label>
      <input type="checkbox" bind:checked />
      <span class="slider" />
    </label>
  </div>
</div>