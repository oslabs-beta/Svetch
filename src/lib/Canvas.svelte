<script>
  import { onMount } from 'svelte';
  import { library, selectedComponent } from '../store';
  import canvasUtility from '../utils/canvasUtility';
  import libraryUtility from '../utils/libraryUtility';

  export let state;

  // Variable to track lifecycle state (used in reactive statement)
  let mounted = false;

  // Variable to track if user is moving a component in the canvas
  let moving = false;

  // Variable to track if user is resizing a component in the canvas
  let resizing = false;

  // Variable to track the current component selection in canvas 
  let selected = null;

  // Variable to track position changes
  let positionUpdates = false;

  // Store the x-coordinate offest for new graphics added to canvas
  let offsetX = -20;

  // Store the y-coordinate offest for new graphics added to canvas
  let offsetY = -20;

  // Declare variable to store the context of canvas (HTML canvas element)
  let ctx;

  // Declare variable to store reference to canvas (HTML canvas element)
  let template;

  // Reactive statement, rerender when library store updates (only if mounted)
  $: {
    if (mounted) rerender(Object.keys($library));
  }

  // HTML CANVAS RENDER FUNCTIONS

  // Define function to render component rectangles to canvas
  const drawComponents = () => {
    // Store list of current component rectangles
    const componentRects = canvasUtility.parse();

    // Clear the canvas context where prototype design is rendered
    ctx.clearRect(200, 0, template.width, template.height);

    // Draw dot background
    drawDots();

    // Render each component rect, adding glow to selected rect (if any)
    componentRects.forEach((rect) => {
      if (rect === selected) rect.addGlow(ctx);

      rect.draw(ctx);
    });
  };

  // Define function to render component library to canvas
  const drawLibrary = () => {
    // Clear the canvas context where library items get rendered
    ctx.clearRect(0, 0, 200, template.height);
    ctx.beginPath();

    // Update styles
    ctx.shadowBlur = 0;
    // ctx.moveTo(200, 0);
    // ctx.lineTo(200, template.height);
    ctx.strokeStyle = '#d7dce0';
    ctx.lineWidth = 2;

    // Render line to divide canvas element (separates library from prototype area of canvas)
    ctx.strokeRect(200, 0, 1, template.height);
    // ctx.strokeStyle = "#d7dce0";
    // ctx.strokeRect(200, 0, 1, template.height);
    // ctx.stroke();

    // Render each library item in library store, draw deleteTab if not is use
    Object.values($library).forEach(({ quantity, rect }) => {
      rect.draw(ctx);
      rect.drawLabel(ctx, '30px serif', rect.x, rect.y + 35, 150);
      if (quantity === 0) rect.drawDeleteTab(ctx);
    });
  };

  // Define function to render dot background on canvas
  const drawDots = () => {
    // Define new path, and styles
    ctx.beginPath();
    ctx.shadowBlur = 0;
    const r = 1;
    const horizontalSpacing = 18;
    const verticalSpacing = 18;

    // Render dots starting at horizontal offest of 218 (so dots don't show in library)
    for (let x = 218; x < template.width; x += horizontalSpacing) {
      for (let y = 18; y < template.height; y += verticalSpacing) {
        ctx.fillStyle = '#d7dce0';
        ctx.fillRect(x - r / 2, y - r / 2, r, r);
      }
    }
  };

  // Define function to calculate new x and y coordinate offsets
  const updateOffsets = () => {
    // Update each by 20 px
    offsetX += 20;
    offsetY += 20;

    // If x offest position causes new rect to render out of bounds, reset it
    if (offsetX + 500 > template.width) offsetX = 0;

    // If y offest position causes new rect to render out of bounds, reset it
    if (offsetY + 200 > template.height) offsetY = 0;
  };

  // Define function to re-render the entire canvas
  const rerender = () => {
    // Library drawn first so prototype area can overlay on dividing line (style choice)
    drawLibrary();
    drawComponents();
  };

  onMount(() => {
    // INITIALIZE LAYOUT VARIABLES, RESTORE STATE IF NEEDED

    // Update template to refer to canvas element (HTML element)
    template = document.getElementById('dotCanvas');

    // Store the parent of canvas element
    const parent = template.parentElement;

    // Define custom resizing observer (track initial layout changes, and user resize events)
    const resizeObserver = new ResizeObserver(entries => {
      // When a resize event occurs, update the canvas width and height
      entries.forEach(entry => {
        template.width = entry.contentRect.width;
        template.height = entry.contentRect.height;
        rerender();
      });
    });

    // Add parent to the custom resize observer
    resizeObserver.observe(parent);

    // Set canvas width to match parent (CSS properties stretch canvas, not resize it)
    template.width = parent.clientWidth;

    // Set canvas height to match parent (CSS properties stretch canvas, not resize it)
    template.height = parent.clientHeight;

    // Store the canvas context
    ctx = template.getContext('2d');

    // When there is stored state (client redirect occured)
    if (state) {
      // Store the cancas and library from state
      const { prevCanvas, prevLib } = JSON.parse(state);

      // Restore the previous canvas (overwrite current store)
      canvasUtility.restore(prevCanvas);

      // Restore the previous library (overwrite current store)
      libraryUtility.restore(prevLib)

      // Delete the state from this component storage
      state = null;

      // Delete the cookie used to persist the old state
      fileUtility.deleteCookie();
    }

    // MOVEMENT FUNCTIONS

    // Defined function to resize component rects
    const resize = (e, rect) => {
      // Ignore resize event if it causes width to be less than 20 px
      if (rect.width + e.movementX > 20) {
        rect.width += e.movementX;
        positionUpdates = true;
      }

      // Ignore resize event if it causes height to be less than 20 px
      if (rect.height + e.movementY > 20) {
        rect.height += e.movementY;
        positionUpdates = true;
      }

      // Re-draw the component rects if updates happened
      if (positionUpdates) drawComponents();
    };

    const move = (e, rect) => {
      // When rect movement is not out of bounds
      if (
        rect.x > 209 
        && rect.y > 0 
        && rect.y + rect.height <= template.height 
        && rect.x + rect.width <= template.width
      ) {
        // Update rect position
        rect.x += e.movementX;
        rect.y += e.movementY;
        positionUpdates = true;
      } else if (rect.x <= 209) { // When component rect was moved into library bounds
        // Re-render library (removes blur effect caused by movement)
        drawLibrary();

        // Re-position component rect to right of library (so glow effect does not bleed into library)
        rect.x = 210;
        positionUpdates = true;
      } else if (rect.y <= 0) { // When component rect was moved out of bounds (top)
        // Re-position component rect within top of canvas
        rect.y = 1;
        positionUpdates = true;
      } else if (rect.y + rect.height >= template.height) { // When component rect was moved out of bounds (bottom)
        // Re-position component rect within bottom edge of canvas
        rect.y = template.height - rect.height;
        positionUpdates = true;
      } else if (rect.x + rect.width >= template.width) { // When component rect was moved out of bounds (right)
        // Re-position component rect within right edge of canvas
        rect.x = template.width - rect.width;
        positionUpdates = true;
      }

      // Re-draw the component rects if updates happened
      if (positionUpdates) drawComponents();
    };

    // EVENT LISTENERS
    template.addEventListener('wheel', (e) => {
      // Call utility method to perform scoll effect
      libraryUtility.repositionItems(template.height, e);
    });

    template.addEventListener('mousedown', (e) => {
      // Store x,y coordinates of mousedown event
      const x = e.offsetX;
      const y = e.offsetY;

      // Store rects from the canvas (as array)
      const componentRects = canvasUtility.parse();

      // Check all component rects to see if they contain x,y coordinate of mouse event
      for (let i = 0; i < componentRects.length; i++) {
        const rect = componentRects[i];

        // When current rect contains location of mousedown event
        if (rect.contains(x, y)) {
          // Udpate selected to be rect (called multiple times when components are nested)
          selected = rect;
          $selectedComponent = selected.id;
          template.style.cursor = 'move';
          moving = true;
        }
      }

      // When there is a selected component, and its resize tab is clicked
      if (selected && selected.resizeTabContains(x, y)) {
        moving = false;
        resizing = true;
        template.style.cursor = 'nwse-resize';

      // When there is a selected component, and its delete tab is clicked
      } else if (selected && selected.deleteTabContains(x, y)) {
        // Component is not moving, it's being deleted
        moving = false;
        template.style.cursor = 'default';

        // Delete the component rect from the canvas store
        canvasUtility.delete(selected);

        // Update the quantity of associated component type in use
        $library[selected.type].quantity -= 1;

        // Set the selected component to be the index (base canvas)
        $selectedComponent = 'index';

        // Re-render the canvas (removes deleted component, updates library)
        rerender();
      } else { // Mousedown event happened on canvas or component rect
        // When there is not a selected component, mousedown occured on background
        if (!selected) $selectedComponent = 'index';

        // When there is a selected component, mousedown occured on component rect
        if (selected) selected.addGlow(ctx); // add glow to the selected component rect

        // Re-render the components (adds glow effect)
        drawComponents()
      }
    });

    //invokes move or resize on mouse movement only if a component is selected
    template.addEventListener('mousemove', (e) => {
      // When there is not a selected componet rect (index selected)
      if (!selected) return;

      // When there is a selected component rect moving
      if (moving === true) move(e, selected);

      // When there is a selected component rect being resized
      if (resizing === true) resize(e, selected);
    });

    //invoked when mouse is released, resets selected component, moving, and resizing variables
    template.addEventListener('mouseup', (e) => {
      // Restore default cursore style
      template.style.cursor = 'default';
      
      //When position updated, trigger relationship updates for the repositioned component
      if (positionUpdates) canvasUtility.updateRelationships(selected);

      // Restore default values for tracking user input on canvas
      moving = false;
      resizing = false;
      selected = null;
      positionUpdates = false;

      // When mouse up occurs inside library
      if (e.offsetX < 200) {
        // Store references to each entry in library store
        const items = Object.entries($library);

        // Iterate through the library items
        for (let i = 0; i < items.length; i += 1) {
          // Store type of current library item
          const type = items[i][0];

          // Store the quantity and associate rect for current library item
          const { quantity, rect } = items[i][1];

          // When library item rect contains mouseup location
          if (rect.contains(e.offsetX, e.offsetY)) {
            // Check if deletable and mouseup happened on delete tab location
            if (quantity === 0 && rect.deleteTabContains(e.offsetX, e.offsetY)) {
              // Delete the item from the library store
              libraryUtility.delete(type);

              // Update the positions of the library item rects
              libraryUtility.update(i);

              // End event lisenter logic (rerender is triggered reactively on library update)
              return;
            } else {
              // Update the quantity of selected rect type in use on canvas
              items[i][1].quantity += 1;

              // Update the x, y offsets for rendering new rects
              updateOffsets();

              // Create a new component rect
              canvasUtility.create({
                x: 300 + offsetX,
                y: 100 + offsetY,
                width: 200,
                height: 100,
                type: rect.type,
                color: rect.color,
              });

            } // end else block

          } // end if (rect.contains...) block

        } // end for loop
      
        // Re-render the entire canvas (shows new component rect, library updates if needed)
        rerender();
      } // end if (e.offsetX < 200) block
    }); // end mouseup event listenter statement

    // Mounting to DOM has occured, reactivity is not allowed
    mounted = true;
  });
</script>

<div>
  <!-- svelte-ignore component-name-lowercase -->
  <canvas id='dotCanvas' />
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
  #dotCanvas {
    display: block;
    border-radius: 12px;
  }
</style>
