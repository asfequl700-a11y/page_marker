document.addEventListener('DOMContentLoaded', () => {
  // Delete All button
  const deleteAllBtn = document.getElementById('delete-all-btn');
  deleteAllBtn.addEventListener('click', () => {
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || [];
      if (highlights.length === 0) {
        return; // Nothing to delete
      }
      showDeleteAllModal();
    });
  });

  loadHighlights();
});

function loadHighlights() {
  chrome.storage.local.get(['highlights'], (result) => {
    const highlights = result.highlights || [];
    const listContainer = document.getElementById('highlights-list');
    
    listContainer.innerHTML = '';

    if (highlights.length === 0) {
      listContainer.className = 'empty-state';
      listContainer.innerHTML = '<p>No saved highlights yet.</p>';
      return;
    }

    listContainer.className = '';
    
    // Sort by newest first
    highlights.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    highlights.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'highlight-card';
      
      const date = new Date(item.timestamp).toLocaleDateString();
      
      card.innerHTML = `
        <div class="card-header">
            <a href="${item.url}" target="_blank" class="page-link" title="${item.url}">${item.title || 'Untitled Page'}</a>
            <span class="date">${date}</span>
        </div>
        <div class="highlight-text">"${item.text}"</div>
        <div class="note-section" id="note-section-${item.id}">
            ${item.note ? `<div class="note-text">${item.note}</div>` : '<div class="note-text" style="color: #999; font-style: italic;">No note added</div>'}
        </div>
        <div class="card-actions">
            <button class="action-btn edit-btn" data-id="${item.id}">Edit Note</button>
            <button class="action-btn delete-btn" data-id="${item.id}">Delete</button>
        </div>
      `;
      
      listContainer.appendChild(card);
    });

    // Add event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            showDeleteModal(id);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            toggleEditMode(id);
        });
    });
  });
}

function toggleEditMode(id) {
    const noteSection = document.getElementById(`note-section-${id}`);
    const currentText = noteSection.querySelector('.note-text').textContent;
    const isPlaceholder = noteSection.querySelector('.note-text').style.fontStyle === 'italic';
    
    // Check if already editing
    if (noteSection.querySelector('textarea')) return;

    const textarea = document.createElement('textarea');
    textarea.className = 'note-input';
    textarea.value = isPlaceholder ? '' : currentText;
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'action-btn save-note-btn';
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => saveNote(id, textarea.value);

    noteSection.innerHTML = '';
    noteSection.appendChild(textarea);
    noteSection.appendChild(saveBtn);
    textarea.focus();
}

function saveNote(id, newNote) {
    chrome.storage.local.get(['highlights'], (result) => {
        let highlights = result.highlights || [];
        const index = highlights.findIndex(item => item.id === id);
        if (index !== -1) {
            highlights[index].note = newNote;
            chrome.storage.local.set({ highlights: highlights }, () => {
                loadHighlights();
            });
        }
    });
}

let itemToDelete = null;

function showDeleteModal(id) {
    itemToDelete = id;
    document.getElementById('confirm-modal').style.display = 'flex';
}

function hideDeleteModal() {
    itemToDelete = null;
    document.getElementById('confirm-modal').style.display = 'none';
}

function showDeleteAllModal() {
  const modal = document.getElementById('confirm-modal');
  const message = modal.querySelector('p');
  message.textContent = 'Are you sure you want to delete ALL notes? This action cannot be undone.';
  modal.style.display = 'flex';
  
  const confirmBtn = modal.querySelector('#confirm-delete');
  const cancelBtn = modal.querySelector('#cancel-delete');
  
  // Remove old listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  
  newConfirmBtn.addEventListener('click', () => {
    chrome.storage.local.set({ highlights: [] }, () => {
      loadHighlights();
      hideDeleteModal();
      
      // Send message to all tabs to remove all highlights
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: "removeAllHighlights" }).catch(() => {});
        });
      });
    });
  });
  
  newCancelBtn.addEventListener('click', hideDeleteModal);
}

// Modal Event Listeners
document.getElementById('cancel-delete').addEventListener('click', hideDeleteModal);

document.getElementById('confirm-delete').addEventListener('click', () => {
    if (itemToDelete) {
        deleteHighlight(itemToDelete);
        hideDeleteModal();
    }
});

function deleteHighlight(id) {
    chrome.storage.local.get(['highlights'], (result) => {
        let highlights = result.highlights || [];
        highlights = highlights.filter(item => item.id !== id);
        chrome.storage.local.set({ highlights: highlights }, () => {
            loadHighlights();
        });
    });
}
