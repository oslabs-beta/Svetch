<script>
    // import { HighlightSvelte } from "svelte-highlight";
    // import monokai from "svelte-highlight/styles/monokai";
      export let code = 'test code';
    // $: code = `<button on:click={() => { console.log(0); }}>Increment {count}</button>`;
// $:console.log(code)
    //     $:{ code =
//     `<script>
//       let count = 0;
//       $: if (count >= 10) {
//         alert('count is dangerously high!');
//         count = 9;
//       }
//       function handleClick() {
//         count += 1;
//       }
//   <\/script>
//   <button on:click={handleClick}>
//     Clicked {count} {count === 1 ? 'time' : 'times'}
//   </button>`};
  </script>
  
  <!-- <svelte:head>
    {@html monokai}
  </svelte:head>
  
  <HighlightSvelte {code} />  -->

  <textarea id = 'block' readonly>{code}</textarea>

  <style>
      #block{
          height: 200px;
          width: 50vw;
          border: 2px solid black;
      }
  </style>