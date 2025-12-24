/* global NexT, CONFIG, mermaid */

document.addEventListener('page:loaded', async () => {
  const mermaidElements = document.querySelectorAll('pre > .mermaid');
  if (mermaidElements.length) {
    await NexT.utils.getScript(CONFIG.mermaid.js, {
      condition: window.mermaid
    });
    mermaidElements.forEach(element => {
      const box = document.createElement('div');
      box.className = 'code-container';
      const newElement = document.createElement('div');
      newElement.innerHTML = element.innerHTML;
      newElement.className = 'mermaid';
      box.appendChild(newElement);
      if (CONFIG.codeblock.copy_button.enable) {
        NexT.utils.registerCopyButton(box, box, element.textContent);
      }
      const parent = element.parentNode;
      parent.parentNode.replaceChild(box, parent);
    });
    mermaid.initialize({
      theme    : CONFIG.darkmode && window.matchMedia('(prefers-color-scheme: dark)').matches ? CONFIG.mermaid.theme.dark : CONFIG.mermaid.theme.light,
      logLevel : 4,
      flowchart: {
        curve: 'linear',
        padding: 10,
        nodeSpacing: 40,
        rankSpacing: 40
      },
      gantt    : { axisFormat: '%m/%d/%Y' },
      sequence : { actorMargin: 50 },
      fontSize : 12,
      themeVariables: {
        fontSize: '12px',
        fontFamily: 'arial, sans-serif'
      }
    });
    mermaid.run().then(() => {
      // Wait a bit for DOM to fully render
      setTimeout(() => {
        // Post-process sequence diagrams to shrink everything
        document.querySelectorAll('.mermaid svg').forEach(svg => {
          // Check if this is a sequence diagram by looking for .actor elements
          const hasActors = svg.querySelector('.actor');
          if (!hasActors) return;

          console.log('=== Processing sequence diagram ===');

          // Separate top and bottom actor rectangles
          const topRects = svg.querySelectorAll('.actor-top');
          const bottomRects = svg.querySelectorAll('.actor-bottom');

          console.log('Found top rects:', topRects.length, 'bottom rects:', bottomRects.length);

          // Process top rectangles
          topRects.forEach(rect => {
            const width = rect.getAttribute('width');
            const height = rect.getAttribute('height');
            const x = rect.getAttribute('x');
            const y = rect.getAttribute('y');

            console.log('Original top rect:', {width, height, x, y});

            // Set to fixed small size
            rect.setAttribute('width', '50');
            rect.setAttribute('height', '27');
            rect.setAttribute('x', parseFloat(x) + 50); // Shift right to recenter
            rect.setAttribute('y', parseFloat(y) + 18); // Shift down
          });

          // Process bottom rectangles - move them UP to stay in view
          bottomRects.forEach((rect, index) => {
            const width = rect.getAttribute('width');
            const height = rect.getAttribute('height');
            const x = rect.getAttribute('x');
            const y = rect.getAttribute('y');

            console.log(`Original bottom rect ${index}:`, {width, height, x, y});

            // Set to fixed small size and move UP significantly
            rect.setAttribute('width', '50');
            rect.setAttribute('height', '27');
            rect.setAttribute('x', parseFloat(x) + 50); // Shift right to recenter
            rect.setAttribute('y', parseFloat(y) - 20); // Move UP instead of down

            console.log(`Adjusted bottom rect ${index}:`, {
              width: rect.getAttribute('width'),
              height: rect.getAttribute('height'),
              x: rect.getAttribute('x'),
              y: rect.getAttribute('y')
            });
          });

          // Adjust actor lines - only reduce y2 (bottom connection point)
          const actorLines = svg.querySelectorAll('.actor-line');
          console.log('Found actor lines:', actorLines.length);
          actorLines.forEach((line, index) => {
            const y1 = parseFloat(line.getAttribute('y1'));
            const y2 = parseFloat(line.getAttribute('y2'));

            console.log(`Original line ${index}: y1=${y1}, y2=${y2}`);

            // y1 is top connection (already adjusted by rect changes)
            // y2 is bottom connection - move it up by 20px
            line.setAttribute('y2', y2 - 20);

            console.log(`Adjusted line ${index}: y2=${line.getAttribute('y2')}`);
          });

          // Adjust marker size by modifying marker definitions
          const markers = svg.querySelectorAll('marker');
          console.log('Found markers:', markers.length);
          markers.forEach(marker => {
            // Make markers 5x smaller
            const markerWidth = parseFloat(marker.getAttribute('markerWidth') || 8);
            const markerHeight = parseFloat(marker.getAttribute('markerHeight') || 8);
            marker.setAttribute('markerWidth', markerWidth / 5);
            marker.setAttribute('markerHeight', markerHeight / 5);
            marker.setAttribute('refX', '1');
            marker.setAttribute('refY', '1');

            // Scale the marker path
            const markerPath = marker.querySelector('path');
            if (markerPath) {
              markerPath.style.transform = 'scale(0.2)';
              markerPath.style.transformOrigin = 'center';
            }
          });

          // Adjust text positions for bottom actors - find all text elements in bottom actor groups
          const allTexts = svg.querySelectorAll('text');
          console.log('Found all text elements:', allTexts.length);

          allTexts.forEach((text, index) => {
            const y = parseFloat(text.getAttribute('y'));
            const textContent = text.textContent;
            console.log(`Text ${index}: y=${y}, content="${textContent}"`);

            // If this is a bottom text (high y value), move it up
            if (y > 300) {
              const oldY = y;
              text.setAttribute('y', y - 19);
              console.log(`Adjusted text ${index} from y=${oldY} to y=${text.getAttribute('y')}`);
            }
          });

          // Adjust viewBox to compact the overall diagram
          const viewBox = svg.getAttribute('viewBox');
          if (viewBox) {
            const [minX, minY, width, height] = viewBox.split(' ').map(Number);
            const newHeight = height * 0.85;
            svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${newHeight}`);
            console.log('Adjusted viewBox from', viewBox, 'to', svg.getAttribute('viewBox'));
          }

          console.log('=== Sequence diagram processing complete ===');
        });
      }, 100); // Wait 100ms for DOM to settle
    });
  }
});
