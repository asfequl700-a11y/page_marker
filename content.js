let markerButton = null;
let markerShadow = null;
let markerRoot = null;

document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // We pass rect now
    showMarkerButton(rect.left + window.scrollX, rect.bottom + window.scrollY, selectedText, rect);
  } else {
    removeMarkerButton();
  }
});

document.addEventListener('mousedown', (event) => {
    // If clicking outside the button/modal, remove it (unless it's the button itself)
    if (markerRoot) {
        const path = event.composedPath();
        if (!path.includes(markerRoot)) {
             // Clicked outside the shadow DOM host
             // We can let the selection change handle it, or force close if needed.
             // But if we are in the modal, we definitely want to know if we clicked outside.
             
             // If modal is open, maybe we should close it? 
             // For now, let's rely on the fact that clicking outside usually clears selection 
             // which triggers the mouseup logic.
             // BUT, if we are editing a note in the modal, we don't want to close it accidentally.
             
             // Let's check if the modal is visible
             const modal = markerShadow?.querySelector('.marker-modal');
             if (modal && modal.style.display === 'flex') {
                 // If click is outside, maybe close?
                 // Actually, the user requirement "buttons should work perfectly" implies
                 // they might have been having trouble with it closing when they didn't want to.
                 // The previous code had a check `!markerRoot.contains(event.target)` which fails for Shadow DOM.
                 // `path.includes(markerRoot)` is the correct check.
             }
        }
    }
});


function showMarkerButton(x, y, text, rect) {
  if (!markerButton) {
    createMarkerUI();
  }

  markerButton.style.display = 'block';
  
  // Position logic: "appear in front of user not in bottom"
  // We'll try to place it above the selection first.
  // rect is the bounding client rect of the selection.
  
  const buttonHeight = 50; // Approx
  const buttonWidth = 140; // Approx
  
  let top = rect.top + window.scrollY - buttonHeight - 10;
  let left = rect.left + window.scrollX + (rect.width / 2) - (buttonWidth / 2);
  
  // If it goes off the top of the screen, put it below
  if (top < window.scrollY) {
      top = rect.bottom + window.scrollY + 10;
  }
  
  // Keep it within horizontal bounds
  if (left < 0) left = 10;
  if (left + buttonWidth > window.innerWidth) left = window.innerWidth - buttonWidth - 10;

  markerButton.style.top = `${top}px`;
  markerButton.style.left = `${left}px`;
  
  // Store the text on the button element for easy access
  markerButton.dataset.selectedText = text;
}

// ... (removeMarkerButton and createMarkerUI remain mostly same, but we need to update the call site)

// Update the mouseup listener to pass the rect


// ... inside createMarkerUI ...
// We need to update the highlight style injection at the bottom of the file first.
// Let's do that in a separate chunk or just include it here if it was close.
// It's at the bottom. I'll use a separate tool call for the style or just do a big replace if it's cleaner.
// Actually, I'll just do the listener and showMarkerButton here.


function removeMarkerButton() {
  if (markerButton) {
    markerButton.style.display = 'none';
  }
}

function createMarkerUI() {
  const host = document.createElement('div');
  host.id = 'page-marker-extension-host';
  host.style.position = 'absolute';
  host.style.top = '0';
  host.style.left = '0';
  host.style.zIndex = '2147483647'; // Max z-index
  host.style.pointerEvents = 'none'; // Let clicks pass through the container
  document.body.appendChild(host);

  markerShadow = host.attachShadow({ mode: 'open' });
  markerRoot = host;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .marker-btn {
      position: absolute;
      background: linear-gradient(135deg, #fdd835 0%, #f9a825 100%);
      color: #000;
      border: 2px solid #f57f17;
      border-radius: 8px;
      padding: 12px 24px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(253, 216, 53, 0.4), 0 2px 8px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px;
      font-weight: 700;
      pointer-events: auto;
      z-index: 1000;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .marker-btn::before {
      content: '📝';
      font-size: 18px;
    }
    .marker-btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 24px rgba(253, 216, 53, 0.5), 0 4px 12px rgba(0,0,0,0.3);
      background: linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%);
      border-color: #f9a825;
    }
    .marker-btn:active {
      transform: translateY(0) scale(1.02);
    }
    .marker-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1e1e1e;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
        width: 320px;
        pointer-events: auto;
        display: none;
        flex-direction: column;
        gap: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        animation: fadeIn 0.2s ease-out;
        color: #e0e0e0;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -48%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
    }
    .marker-modal h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
    }
    .marker-modal textarea {
        width: 100%;
        height: 100px;
        padding: 12px;
        border: 1px solid #424242;
        border-radius: 8px;
        resize: none; /* Disable resize */
        font-family: inherit;
        font-size: 14px;
        line-height: 1.5;
        color: #e0e0e0;
        background-color: #2c2c2c;
        transition: border-color 0.2s, background-color 0.2s;
        box-sizing: border-box;
        overflow-y: auto; /* Scrollbar if needed */
    }
    .marker-modal textarea:focus {
        outline: none;
        border-color: #fdd835;
        background-color: #2c2c2c;
    }
    /* Custom Scrollbar */
    .marker-modal textarea::-webkit-scrollbar {
        width: 6px;
    }
    .marker-modal textarea::-webkit-scrollbar-track {
        background: transparent;
    }
    .marker-modal textarea::-webkit-scrollbar-thumb {
        background-color: #616161;
        border-radius: 3px;
    }
    .marker-modal textarea::-webkit-scrollbar-thumb:hover {
        background-color: #757575;
    }
    .marker-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
    .marker-btn-save, .marker-btn-cancel {
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    .marker-btn-save {
        background: #fdd835;
        color: #121212;
    }
    .marker-btn-save:hover {
        background: #fbc02d;
    }
    .marker-btn-cancel {
        background: #424242;
        color: #e0e0e0;
    }
    .marker-btn-cancel:hover {
        background: #616161;
    }
    .marker-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        left: auto;
        transform: translateY(100px);
        background-color: #323232;
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 1001;
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s;
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #444;
    }
    .marker-toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    .marker-toast svg {
        width: 20px;
        height: 20px;
        fill: #4caf50;
    }
  `;
  markerShadow.appendChild(style);

  // Create Button
  markerButton = document.createElement('button');
  markerButton.className = 'marker-btn';
  markerButton.textContent = 'Save Note';
  markerButton.style.display = 'none';
  markerButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal();
  });
  markerShadow.appendChild(markerButton);

  // Create Modal
  const modal = document.createElement('div');
  modal.className = 'marker-modal';
  modal.innerHTML = `
    <h3>Add a Note</h3>
    <textarea placeholder="Enter your note here..."></textarea>
    <div class="marker-modal-actions">
        <button class="marker-btn-cancel">Cancel</button>
        <button class="marker-btn-save">Save</button>
    </div>
  `;
  markerShadow.appendChild(modal);

  // Create Toast
  const toast = document.createElement('div');
  toast.className = 'marker-toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
    <span>Note saved!</span>
  `;
  markerShadow.appendChild(toast);

  // Modal Logic
  const textarea = modal.querySelector('textarea');
  const saveBtn = modal.querySelector('.marker-btn-save');
  const cancelBtn = modal.querySelector('.marker-btn-cancel');

  saveBtn.addEventListener('click', () => {
      const note = textarea.value;
      const text = markerButton.dataset.selectedText;
      saveHighlight(text, note);
      modal.style.display = 'none';
      textarea.value = '';
      removeMarkerButton();
      window.getSelection().removeAllRanges(); // Clear selection
  });

  cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      textarea.value = '';
      window.getSelection().removeAllRanges();
  });
}

function openModal() {
    const modal = markerShadow.querySelector('.marker-modal');
    modal.style.display = 'flex';
    markerButton.style.display = 'none';
}

function showToast(message) {
    const toast = markerShadow.querySelector('.marker-toast');
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveHighlight(text, note) {
    const data = {
        id: Date.now().toString(),
        url: window.location.href,
        title: document.title,
        text: text,
        note: note,
        timestamp: new Date().toISOString()
    };

    chrome.storage.local.get(['highlights'], (result) => {
        const highlights = result.highlights || [];
        highlights.push(data);
        chrome.storage.local.set({ highlights: highlights }, () => {
            console.log('Highlight saved:', data);
            // Immediately highlight the text on the page
            highlightTextOnPage(text);
            // Show toast notification
            showToast('Note saved!');
        });
    });
}

// Restore highlights on load
function restoreHighlights() {
    // Check if extension context is valid
    if (!chrome.runtime?.id) return;

    const currentUrl = window.location.href;
    try {
        chrome.storage.local.get(['highlights'], (result) => {
            if (chrome.runtime.lastError) return; // Handle potential errors
            const highlights = result.highlights || [];
            const pageHighlights = highlights.filter(h => h.url === currentUrl);
            
            pageHighlights.forEach(h => {
                highlightTextOnPage(h.text);
            });
        });
    } catch (e) {
        console.log('Extension context invalidated, stopping script execution');
    }
}

// Inject styles for highlights and markers
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .page-marker-highlight {
        background-color: rgba(255, 235, 59, 0.2) !important; /* Subtle background */
        background-image: linear-gradient(to right, #d32f2f, #f44336, #ff9800, #ffc107, #ffeb3b) !important; /* Red, Orange, Yellow gradient */
        background-size: 100% 3px !important;
        background-position: 0 100% !important;
        background-repeat: no-repeat !important;
        color: inherit !important;
        padding-bottom: 1px;
        margin: 0;
        border-radius: 2px;
        box-shadow: none;
        cursor: pointer;
    }
`;
document.head.appendChild(highlightStyle);

function highlightTextOnPage(searchText) {
    if (!searchText) return;
    
    // Escape regex characters and allow flexible whitespace
    const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace spaces with pattern matching any whitespace (including none, for block boundaries)
    const pattern = escapedText.replace(/\s+/g, '\\s*');
    const regex = new RegExp(pattern, 'gi');

    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            // Allow highlighted nodes so we can match text that spans across them
            if (node.parentElement && (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE')) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const nodeList = [];
    while(treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);

    // We need to match the regex against the concatenated text of the nodes
    // AND keep track of where each node starts/ends in that concatenated text.
    
    let totalText = "";
    const nodeMap = [];
    
    nodeList.forEach(node => {
        const start = totalText.length;
        totalText += node.nodeValue;
        const end = totalText.length;
        nodeMap.push({node, start, end});
    });

    let match;
    // Reset regex index just in case
    regex.lastIndex = 0;
    
    // We need to collect all matches first to avoid messing up indices while modifying DOM
    const matches = [];
    while ((match = regex.exec(totalText)) !== null) {
        matches.push({
            start: match.index,
            end: match.index + match[0].length
        });
    }

    matches.reverse().forEach(match => {
        const matchStart = match.start;
        const matchEnd = match.end;
        
        // Find which nodes cover this match
        const startNodeIndex = nodeMap.findIndex(n => n.end > matchStart);
        const endNodeIndex = nodeMap.findIndex(n => n.end >= matchEnd);
        
        if (startNodeIndex === -1 || endNodeIndex === -1) return;

        // Highlight from endNode back to startNode
        for (let i = endNodeIndex; i >= startNodeIndex; i--) {
            const nodeInfo = nodeMap[i];
            const node = nodeInfo.node;
            
            // Skip if already highlighted to avoid double wrapping
            if (node.parentElement && node.parentElement.classList.contains('page-marker-highlight')) {
                continue;
            }

            let startOffset = 0;
            let endOffset = node.nodeValue.length;
            
            if (i === startNodeIndex) {
                startOffset = matchStart - nodeInfo.start;
            }
            if (i === endNodeIndex) {
                endOffset = matchEnd - nodeInfo.start;
            }
            
            // Skip empty ranges
            if (startOffset === endOffset) continue;

            try {
                const range = document.createRange();
                range.setStart(node, startOffset);
                range.setEnd(node, endOffset);
                
                const mark = document.createElement('mark');
                mark.className = 'page-marker-highlight';
                // Styles are now in the injected CSS
                
                range.surroundContents(mark);
            } catch (e) {
                console.warn('Highlight error:', e);
            }
        }
    });
}

// Run restore on load
restoreHighlights();

// Observe DOM changes to handle dynamic content (SPAs)
let timeout = null;
const observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        restoreHighlights();
    }, 500); // Debounce for 500ms
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Listen for URL changes (for SPAs that use History API)
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    restoreHighlights();
  }
}).observe(document, {subtree: true, childList: true});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "removeHighlight") {
        removeHighlightFromPage(request.text);
    } else if (request.action === "removeAllHighlights") {
        removeAllHighlightsFromPage();
    }
});

function removeHighlightFromPage(text) {
    const marks = document.querySelectorAll('.page-marker-highlight');
    marks.forEach(mark => {
        if (mark.textContent === text) {
            const parent = mark.parentNode;
            while (mark.firstChild) {
                parent.insertBefore(mark.firstChild, mark);
            }
            parent.removeChild(mark);
        }
    });
}

function removeAllHighlightsFromPage() {
    const marks = document.querySelectorAll('.page-marker-highlight');
    marks.forEach(mark => {
        const parent = mark.parentNode;
        while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
    });
}
