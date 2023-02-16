<script>
  import { options } from "../store.js";
  
  let name;
  let color;
  let enterName = true;
  let y = 20;
  let reset;
  
  $:{ if($options.length) {y = ($options[$options.length - 1].y + 60)}
  else y = 20;}
  
  
  const handleSubmission = () => {
      let errorMessage = document.getElementById("errorMessage");
      let alreadyExists = false;
      for (let i = 0; i < $options.length; i++) {
          if ($options[i].type == name.value) alreadyExists = true;
      } 
      if (name.value === '') {   
          errorMessage.innerText = "Please provide a name"
          enterName = false;
          return;
      } else if (alreadyExists == true) {
          errorMessage.innerText = "Please provide a unique name"
          enterName = false;
          alreadyExists = false;
          return;   
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
  <h1>Create New Component</h1><br>
  
  <label for="componentName">Component Name</label><br>
  <input bind:this={name} type="text" id="componentName" name="componentName" value=""><br>
  <!-- <h2 hidden={enterName}> Please enter a name </h2> -->
  <h2 id= "errorMessage" hidden={enterName}> </h2>
  
  <label for="color-select">Choose a Color:</label>
  <select bind:this={color} name="color" id="color-select">
      <option value="">--Please choose an option--</option>
      <option value="blue">Blue</option>
      <option value="red">Red</option>
      <option value="yellow">Yellow</option>
      <option value="orange">Orange</option>
      <option value="purple">Purple</option>
      <option value="green">Green</option>
  </select><br>
  
  <button on:click = { () => handleSubmission()}>Submit</button><br>
  <h1 style='text-align: center;'>Quickstart Guide</h1><br>
    <hr>
    <br>
    <div class="quickstart">
      <h3>Getting Started</h3>
      <ul>
          <li>The dotted grid to the right is the canvas, and represents your Index.svelte file.</li>
          <li> To add components to the canvas, enter the name of your component and select a color.</li> 
          <li>When you hit the Submit button, the new component will appear in the components menu. 
          Click the component and it will appear in the canvas, as well as in file structure window.</li>
      </ul>
  
  <br>
  <h3>Arranging Components</h3>
      <ul>
          <li>
              You can move a component by clicking down 
              inside of the box and dragging it around the canvas, then release your mouse to finalize it's position.
          </li>
          <li>
              You can also resize your components by clicking down and dragging the small black tab at the bottom right corner.
              To remove a component from the canvas click on the "X" in the upper right corner.
          </li>
      </ul>
  <br>
  <h3>Tracking Heirarchy</h3> 
      <ul>
          <li>
              Svetch will automatically track the heirarchy you create in the canvas 
              and update your component files accordingly.
          </li>
          <li>
              You can view a tree diagram of your component hierarchy by clicking the toggle button in the upper right corner 
              of the canvas.  Once there, you can click on the name of your components to expand the tree and see the components nested inside.
          </li>
  
      </ul>
  <br>
  <h3>Code</h3>
      <ul>
          <li>
              To preview a components code, simply click on its box inside of the canvas, and the code
              block will update (remember that the entire canvas defaults to Index.svelte).  
          </li>
      </ul>
    </div>
    <br>
    <hr>
  
  
  
  
  
  
  <style>
  
  .quickstart {
    height: 50%;
    padding-left: 10px;
    overflow: hidden;
    overflow-y: scroll; 
  }
  
  h1 {
    padding-top: 1rem;
    text-align: center;
  }
  ul {
    padding-left: 10px;
  }
  h2{
      color: red;
  }
  
  </style>