import { library } from '../store';
import Rect from './rect';

export default {
  create: (type, color, y) => {
    // Update the library store value
    library.update((lStore) => {
      const rect = new Rect(20, y, 150, 50, type, color);

      // Add new library object to store
      lStore[type] = { quantity: 0, rect };

      // Return the updated store value
      return lStore;
    });
  },

  delete: (type) => {
    // Update the library store value
    library.update((lStore) => {
      // Delete the library item for this type
      delete lStore[type];

      // Return the updated store value
      return lStore;
    });
  },

  update: (index) => {
    // Update the library store value
    library.update((lStore) => {
      // Store an array of items to be moved (use type key)
      const typesToMove = Object.keys(lStore).filter((key, i) => i >= index);

      // Iterate through type keys, move associate rect
      typesToMove.forEach((type) => {
        lStore[type].rect.y -= 60;
      });

      // Return the new store value
      return lStore;
    });
  },

  reset: () => library.set({}),

  restore: (oldStore) => {
    // Iterate through oldStore rects
    Object.values(oldStore).forEach(({ rect }) => {
      // Set each rect prototype to be same as Rect (class)
      Object.setPrototypeOf(rect, Rect.prototype);
    });

    // Update the library store to be oldStore value (with udpated prototypes)
    library.set(oldStore);
  },

  repositionItems: (frameHeight, event = null) => {
    // Update the value of library store
    library.update((lStore) => {
      // Store an array of library items
      const items = Object.values(lStore);

      // Define constant NONE for readability
      const NONE = null;

      // Define constant TOP for readability
      const TOP = 1;

      // Define constant BOTTOM for readability
      const BOTTOM = 2;

      // Define constant SCROLL for readability
      const SCROLL = 3;

      // Define constant RESET for readability
      const RESET = 4;

      // Define helper function to perfom scroll-like movements
      const scrollToTop = () => {
        items.forEach(({ rect }, index) => {
          // eslint-disable-next-line no-param-reassign
          rect.y = 20 + index * 60;
        });
      };

      // Define helper function to perfom scroll-like movement to bottom of library frame
      const scrollToBottom = () => {
        items.forEach(({ rect }, index) => {
          // eslint-disable-next-line no-param-reassign
          rect.y = frameHeight - 10 - (items.length - index) * 60;
        });
      };

      // Define helper function to perfom scroll-like movement to top of library frame
      const scroll = (scale, maxY = null) => {
        // Iterate through library items
        for (let i = 0; i < items.length; i += 1) {
          // Store reference to current rect
          const { rect } = items[i];

          // Update rect postition
          rect.y -= event.deltaY * scale;

          // When current rect is first library item, and its y position is past maxY
          if (i === 0 && maxY && rect.y > maxY) {
            // Invoke scroll to top to fix positioning of entire library (fix start position)
            scrollToTop();

            // Break statement ends loop (scroll logic handled by scrollToTop fn)
            break;
          }
        }
      };

      const moveType = () => {
        // When there are no items to scroll, return NONE
        if (!items.length) return NONE;

        // Store reference to first library item
        const firstItem = items[0];

        // Store reference to last library item
        const lastItem = items[items.length - 1];

        // Store y value for top of first library item
        const topOfFirstItem = firstItem.rect.y;

        // Store y value for bottom of last library item
        const bottomOfLastItem = lastItem.rect.y + lastItem.rect.height;

        // Boolean indicates if any items are out of library frame (rendered outside canvas area)
        const outOfFrame = bottomOfLastItem > frameHeight || topOfFirstItem < 0;

        // Boolean indicates if top and bottom item are in frame, scroll passed start
        const topOutOfPosition = bottomOfLastItem < frameHeight && topOfFirstItem < 20;

        // Boolean indicates a scroll-like event happened on library area of canvas
        const didScroll = event && event.offsetX < 200;

        // Boolean indicates the scroll event passed starting position
        const passedStart = didScroll && event.deltaY < 0 && topOfFirstItem >= 20;

        // Boolean indicates the scroll event passed final position
        const passedBottom = didScroll && event.deltaY > 0 && bottomOfLastItem <= frameHeight - 20;

        // When scroll event happens and any item is out of frame
        if (didScroll && outOfFrame) {
          // Prevent event propagation
          event.preventDefault();

          // When the item scroll passed starting position, move type is TOP
          if (passedStart) return TOP;

          // When the item scroll passed final position, move type is BOTTOM
          if (passedBottom) return BOTTOM;

          // When out of frame, but within start and final positions, move type is SCROLL
          return SCROLL;
        }

        // When the scroll up happens (all items in frame) and top item is not at start position
        if (didScroll && topOutOfPosition && event.deltaY < 0) return RESET; // move type is RESET

        // When none of these conditions happen, move type is NONE
        return NONE;
      };

      // Store value from calling move type helper function
      const move = moveType();

      // Switch on move value
      switch (move) {
        case TOP:
          scrollToTop();
          break;
        case BOTTOM:
          scrollToBottom();
          break;
        case SCROLL:
          scroll(0.5);
          break;
        case RESET:
          scroll(0.5, 20);
          break;
        default:
          break;
      }

      // Return store value (after scroll-like updates)
      return lStore;
    });
  }
};
