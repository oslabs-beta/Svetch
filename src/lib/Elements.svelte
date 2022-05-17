<script>
import { options } from "../store.js";
import optionUtility from "../utils/optionUtility.js";

let name;
let color;
let enterName = true;
let y = 20;
let reset;

$:{ if($options.length) {y = ($options[$options.length - 1].y + 60)}
else y = 20;}

const handleSubmission = () => {
if (name.value === '') 
{
    enterName = false;
    return
}
    enterName = true;
    const option = {
        x: 20,
        y: y ,
        width: 150 , 
        height: 50,
        type: name.value,
        color: color.value,
        deletable : true,
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
<h2 hidden={enterName}> Please enter a name </h2>

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

<button on:click = { () => handleSubmission()}>Submit</button>


<style>
h1 {
	padding-top: 1rem;
	text-align: center;
}
h2{
    color: red;
}

</style>