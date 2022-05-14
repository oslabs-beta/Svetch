<script>
import {boxes} from "../store.js"



let boxArr;
boxes.subscribe((val) => boxArr = val);

	
let boxName = '';
let boxColor = '';
let newBox = (boxName, boxColor) =>
{
let box = {
    x : 20,
    y : (boxArr[boxArr.length - 1].y + 60) || 20,
    width : 150 , 
    height : 50,
    type : boxName,
    color : boxColor
}
boxArr.push(box);
boxes.update(n => boxArr);
$boxes = $boxes; 
//console.log(boxes)
return
}

</script>


<!-- //div contains html elements list declared above -->
<h1>Create New Component</h1>

<label for="componentName">Component Name</label><br>
<input type="text" id="componentName" name="componentName" value=""><br>

<label for="color-select">Choose a Color:</label>
<select name="color" id="color-select">
    <option value="">--Please choose an option--</option>
    <option value="blue">Blue</option>
    <option value="red">Red</option>
    <option value="yellow">Yellow</option>
    <option value="orange">Orange</option>
    <option value="pink">Pink</option>
    <option value="green">Green</option>
</select><br>

<button on:click = { () => newBox(document.getElementById("componentName").value, document.getElementById('color-select').value)}>Submit</button>


<style>
h1 {
	padding-top: 1rem;
	text-align: center;
}

</style>