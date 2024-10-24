/*global chrome*/
// Listen for mouseup event to detect text selection
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    chrome.runtime.sendMessage({ type: 'TEXT_SELECTED', text: selectedText });
  }
})