# Page Marker.

A lightweight Chrome extension to highlight text and add comments on any webpage. Great website for researchers, students, and others to highlight and remember important material. 

![Version](https://img.shields.io/badge/version-1.0-blue.svg).
![License](https://img.shields.io/badge/license-MIT-green.svg).

# Features.

- Choose any text from the page and underline it with a smart gradient underline.
- Attach contextual notes to your highlights for better context.
- Auto-save is there for your help and doesn't need any manual saving of work. 
- The website is single page application ready. It can be used with dispatched pages.
- It has a visually-appealing user interface with dark background.
- Your data is stored locally in your browser. We do not use any remote servers.
- Lightweight - Built with pure JavaScript and requires no library

# Installation.

From Source.

1. Make a copy by downloading the ZIP file

```bash.
git clone https://github.com/yourusername/page-marker.git.
```.

2. Find the extension by going on Chrome

3. Enable Developer mode (toggle in the top-right corner).

4. Click Load unpacked and select the `page-marker` directory.

5. The Page Marker icon should now appear in your Chrome toolbar!

# How to Use.

Highlighting Text.

1. Highlight any text present on web pages.
2. A yellow button will appear near your selection, click Save Note.
3. You can enter your note in the appearing modal that shows up your note.
4. Press save to keep your highlight and note.

Managing Highlights.

1. To see all the highlights, click on the page marker icon from the toolbar.
2. To edit a highlight, click on the Edit Note button.
3. To delete any highlight, simply click on Delete.
4. You can clear everything with the Delete All Notes button. 

Visual Indicators.

- When words you highlight in colored gradient (red – orange – yellow).
- The colour of the text is left unchanged.
- A light yellow tinge in the background helps you identify the marked part.

# Technical Details.

Built With.

- Latest Chrome extension standard. 
- All performance, no frameworks, just vanilla JavaScript.
- Shadow DOM stops style conflicts from happening with your web pages. 
- The Chrome Storage API is for local storage.

File Structure.

```.
page-marker/.
├── manifest.json       # Extension configuration.
Main content script (highlighting logic) : content.js
├── content.css         # Highlight styles.
Popup.html is the extension's popup interface
├── popup.js            # Popup functionality.
├── popup.css           # Popup styles.
└── icons/              # Extension icons.
├── icon16.png.
├── icon48.png.
└── icon128.png.
```.

Key Features Implementation.

- The Save Note button cleverly adjusts its position to above or below the selected text.

- Highlighting across a DOM element is a feature that encompasses a span of text ranging from one DOM to another.
- Monitors URL changes and DOM mutations to dynamically restore highlights (SPA Support).
- We use Shadow DOM to prevent CSS clashes with host pages.

# Customization.

To change how the highlight looks, edit the .page-marker-highlight class in content.js.

```css.
.page-marker-highlight {.
background-color: rgba(255, 235, 59, 0.2) !important;.
background-image: linear-gradient(.
to right,.
#d32f2f,.
#f44336,.
#ff9800,.
#ffc107,.
#ffeb3b.
) !important;.
/ Customize colors here /.
}.
```.

# Known Limitations.

- Pages that entirely recreate the DOM will not retain highlights.
- Some websites with strict Content Security Policies may not work fully.
- Highlights are saved for specific URL variations (params matter).

# Contributing.

Contributions are welcome! Here's how you can help.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

# License.

This project is under the MIT License. See the LICENSE file for more details.

# Future Enhancements.

- Save your highlights as a PDF or Markdown.
- Keep your highlights updated on all your devices.
- A color picker that allows users to choose their highlight colors.
- Look for and eliminate functionality.
- Organizing highlights with a tagging system.
- [ ] Keyboard shortcuts.

# Contact.

Have questions or suggestions? Feel free to open an issue on GitHub!

---.

Made with ❤️ by 

Asfequl Alam Fahim.

