/*global chrome*/
// Listen for mouseup event to detect text selection
let textArr = []
let shouldListen = false
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText && shouldListen) {
    textArr.push(selectedText)
    highlightTextInNode(document.body, selectedText)
    chrome.runtime.sendMessage({ type: 'TEXT_SELECTED', text: selectedText });
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
    if (message.type === 'SHOULD_LISTEN') {
        shouldListen = message.shouldListen
    }
 
    if (message.type === 'CLEAR_SELECTIONS') {
        const docs = document.getElementsByClassName('highlighted__Text__lol')
        for(const doc of docs) {
            doc.style.backgroundColor = 'unset !important'
        }
    }

    if (message.type === 'INIT') {
        textArr = message.selectedTexts
        textArr.forEach((text) => {
          highlightTextInNode(document.body, text)
        })
    }
})

function highlightTextInNode(node, textToHighlight) {
  // Create a regular expression for the text to highlight
  const regex = new RegExp(`(${textToHighlight})`, "gi");

  // If the node is a text node
  if (node.nodeType === Node.TEXT_NODE) {
    const matches = node.nodeValue.match(regex);
    if (matches) {
      // Split the text node into parts based on the regex
      const parts = node.nodeValue.split(regex);
      // Create a document fragment to hold new nodes
      const fragment = document.createDocumentFragment();

      // Create elements for each part
      parts.forEach((part) => {
        if (regex.test(part)) {
          // If the part matches, wrap it in a span
          const span = document.createElement("span");
          span.className = "highlighted__Text__lol";
          span.style.backgroundColor = "yellow";
          span.textContent = part; // Use textContent to avoid HTML injection
          fragment.appendChild(span);
        } else {
          // If it doesn't match, just add the text node
          fragment.appendChild(document.createTextNode(part));
        }
      });

      // Replace the original text node with the new fragment
      node.parentNode.replaceChild(fragment, node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // If the node is an element, recursively check its child nodes
    node.childNodes.forEach((childNode) => highlightTextInNode(childNode, textToHighlight));
  }
}
