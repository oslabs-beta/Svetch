<script>
  import { onMount } from 'svelte';
  import fileUtility from './utils/fileUtility'
  import libraryUtility from './utils/libraryUtility';
  import { library } from '../store';

  let name;
  let color;
  let y = 20;
  let errorMessage = '';

  $: {
    const libraryItems = Object.keys($library);
    if (libraryItems.length) {
      const lastKey = libraryItems[libraryItems.length - 1];
      y = $library[lastKey].rect.y + 60;
    }
    else y = 20;
  }

  const handleSubmission = () => {
    errorMessage = '';
    const safeName = fileUtility.formatName(name.value);
    const safeColor = color.value || 'white';
    const libraryKeys = Object.keys($library);
    for (let i = 0; i < libraryKeys.length; i++) {
      if (libraryKeys[i] == safeName) {
        errorMessage = 'Please provide a unique name';
        return;
      }
    }
    if (name.value === '') {
      errorMessage = 'Please provide a name';
      return;
    }
    if (name.value.length < 3) {
      errorMessage = 'Must contain at least 3 characters';
      return;
    }
  
    libraryUtility.create(safeName, safeColor, y);
    name.value = '';
    color.value = '';
    return;
  };

  onMount(() => {

    const quickstart = document.querySelector('.quickstart');

    const debouce = () => {
      let timeoutId;
      return () => {
        clearTimeout(timeoutId);
        quickstart.classList.remove('hideScroll');
        timeoutId = setTimeout(() => {
          quickstart.classList.add('hideScroll');
        }, 300);
      }
    };

    const cb = debouce();

    quickstart.addEventListener('scroll', cb)
  });
</script>

<h1>Create New Component</h1>
<label for='componentName'>Component Name:</label>
<input
  bind:this={name}
  type='text'
  id='componentName'
  name='componentName'
  value=''
/>

{#if errorMessage !== ''}
  <h5 id='errorMessage'>{errorMessage}</h5>
{/if}
<label for='color-select'>Color:</label>
<select bind:this={color} name='color' id='color-select'>
  <option value=''>-- Please choose a color --</option>
  <option value='#81a1c1'>Blue</option>
  <option value='#a3be8c'>Green</option>
  <option value='#d7dce0'>Grey</option>
  <option value='#e9897c'>Orange</option>
  <option value='#7879FF'>Purple</option>
  <option value='#EB4748'>Red</option>
  <option value='white'>White</option>
  <option value='#F2F270'>Yellow</option>
</select>

<button on:click={() => handleSubmission()}>Submit</button>
<h1 style='text-align: center;'>Quickstart Guide</h1>
<hr />
<div class='quickstart hideScroll'>
  <h3>Getting Started</h3>
  <ul>
    <li>
      The dotted grid to the right is the Canvas, and represents your
      <span class='codeSnippet'>`index.svelte`</span> file.
    </li>
    <li>
      To add components to the Canvas, enter the name of your component and
      select a color.
    </li>
    <li>
      When you click the Submit button, the new component will appear in the
      components library (left of Canvas). Click the component and it will appear in the Canvas, as
      well as the Code Preview and Directory panes.
    </li>
  </ul>
  <h3>Arranging Components</h3>
  <ul>
    <li>
      You can move a component by clicking down inside of the box and dragging
      it around the Canvas, then release your mouse to finalize its position.
    </li>
    <li>
      You can also resize your components by clicking down and dragging the
      small tab at the bottom right corner. To remove a component from the
      Canvas click on the X in the upper right corner.
    </li>
  </ul>
  <h3>Tracking Heirarchy</h3>
  <ul>
    <li>
      Svetch will automatically track the heirarchy you create in the Canvas and
      update your component files accordingly.
    </li>
    <li>
      You can view a tree diagram of your component hierarchy by clicking the
      toggle in the upper right corner of the Canvas. When viewing the tree diagram, you can
      click on the name of your components to expand the tree and see the
      components nested structure.
    </li>
  </ul>
  <h3>Code</h3>
  <ul>
    <li>
      To preview a component's code, simply click on its box inside of the
      Canvas or its name in the Directory pane, and the Code Preview pane will update (Note that the entire Canvas
      defaults to <span class='codeSnippet'>`index.svelte`</span>).
    </li>
  </ul>
</div>
<hr class='hr-bottom'/>

<style>
  .quickstart {
    margin-left: 1rem;
    overflow: hidden;
    overflow-y: auto;
  }
  .quickstart::-webkit-scrollbar {
    width: 12px;
  }
  .quickstart::-webkit-scrollbar-thumb {
    background-color: #75838D;
    border-radius: 100px;
  }
  .hideScroll::-webkit-scrollbar-thumb {
    background-color: #B0B8BF;
    transition: background-color 5s ease;
  }
  h1 {
    padding-top: 1rem;
    text-align: center;
  }
  ul {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
  h5 {
    color: #EB4748;
    font-size: 0.9rem;
    padding-left: 1.5rem;
  }
  h3 {
    margin-top: 0.5rem;
  }
  hr {
    border: 0.5px solid #003659;
  }
  hr.hr-bottom {
    margin-bottom: 0.4rem;
  }
  button {
    border-radius: 0.75rem;
    padding: 0.5rem 1rem;
    border: 1px solid #282b2e;
    color: #d7dce0;
    background-color: #003659;
    margin: 1.5rem;
  }
  button:hover {
    border: 1px solid #d7dce0; 
    background-color: #001829;
  }
  input, select{
    background-color: #d7dce0;
    margin: unset;
    padding: 0.2rem;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    flex: none;
  }
  label {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    margin-top: 1rem;
  }
  .codeSnippet {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 200;
  }
</style>
