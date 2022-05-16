<script>
import { options } from "../store.js"

let name;
let color;

const handleSubmission = (name, color) => {
    const option = {
        x: 20,
        y: ($options[$options.length - 1].y + 60) || 20,
        width: 150 , 
        height: 50,
        type: name.value,
        color: color.value
    }
    options.update(n => [...n, option]);
    name.value = '';
    color.value = '';
    return;
}
</script>


<!-- //div contains html elements list declared above -->
<h1>Create New Component</h1>

<label for="componentName">Component Name</label><br>
<input bind:this={name} type="text" id="componentName" name="componentName" value=""><br>

<label for="color-select">Choose a Color:</label>
<select bind:this={color} name="color" id="color-select">
    <option value="">--Please choose an option--</option>
    <option value="blue">Blue</option>
    <option value="red">Red</option>
    <option value="yellow">Yellow</option>
    <option value="orange">Orange</option>
    <option value="pink">Pink</option>
    <option value="green">Green</option>
</select><br>

<button on:click = { () => handleSubmission(name, color)}>Submit</button>


<style>
h1 {
	padding-top: 1rem;
	text-align: center;
}

</style>