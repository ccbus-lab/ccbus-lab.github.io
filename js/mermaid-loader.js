// Custom Mermaid loader for Hexo-rendered plaintext code blocks
// This script finds code blocks with mermaid syntax and prepares them for Mermaid.js

document.addEventListener('DOMContentLoaded', function() {
  // Find all plaintext code blocks
  const plaintextBlocks = document.querySelectorAll('figure.highlight.plaintext');

  plaintextBlocks.forEach(figure => {
    // Get the code content from the .code td (not .gutter td which has line numbers)
    const codeCell = figure.querySelector('td.code');
    if (!codeCell) return;

    // Extract text from all .line spans, joining with newlines
    const lineSpans = codeCell.querySelectorAll('.line');
    if (lineSpans.length === 0) return;

    const codeLines = Array.from(lineSpans).map(span => span.textContent);
    const codeText = codeLines.join('\n').trim();

    // Check if it's a mermaid diagram by looking for mermaid keywords
    const mermaidKeywords = [
      'graph ', 'flowchart ', 'sequenceDiagram', 'classDiagram',
      'stateDiagram', 'erDiagram', 'journey', 'gantt',
      'pie', 'gitGraph', 'mindmap', 'timeline', 'quadrantChart'
    ];

    const isMermaid = mermaidKeywords.some(keyword =>
      codeText.startsWith(keyword) || codeText.includes('\n' + keyword)
    );

    if (isMermaid) {
      // Replace the entire figure with a simple pre > code.mermaid structure
      const newPre = document.createElement('pre');
      const newCode = document.createElement('code');
      newCode.className = 'mermaid';
      newCode.textContent = codeText;
      newPre.appendChild(newCode);

      // Replace the figure with the new pre
      figure.parentNode.replaceChild(newPre, figure);
    }
  });
});
