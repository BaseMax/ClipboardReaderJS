// Elements
const output = document.getElementById('output');

// Functions
function updateOutput(content) {
    output.innerHTML = content;
}

function handleText(text) {
    updateOutput(`Plain Text detected: <pre>${escapeHtml(text)}</pre>`);
}

function handleHTML(html) {
    updateOutput(`HTML detected: <div>${html}</div>`);
}

function handleFiles(files) {
    let outputHTML = 'Files detected: <ul>';
    for (const file of files) {
        outputHTML += `<li>${file.name} (Type: ${file.type}, Size: ${file.size} bytes)</li>`;
    }
    outputHTML += '</ul>';
    updateOutput(outputHTML);
}

function handleImage(data) {
    const image = new Image();
    image.src = data;
    image.onload = () => {
        updateOutput(`Image detected: <img src="${data}" alt="Pasted Image" />`);
    };
    image.onerror = () => {
        updateOutput(`Failed to load image.`);
    };
}

function handleBinary(binaryData) {
    updateOutput(`Binary detected: <pre>${escapeHtml(binaryData)}</pre>`);
}

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[match]);
}

function isBinary(text) {
    return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text);
}

function isImage(text) {
    const imagePattern = /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico|heif|heic|apng|avif)$/i;
    const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|svg\+xml|tiff|ico|heif|heic|apng|avif);base64,/i;
    return imagePattern.test(text) || base64Pattern.test(text);
}

// Events
document.getElementById('clipboardText').addEventListener('paste', (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('Text');
    const pastedHTML = clipboardData.getData('text/html');
    const pastedFiles = clipboardData.files;

    if (pastedFiles.length > 0) {
        handleFiles(pastedFiles);
    } else if (pastedHTML) {
        handleHTML(pastedHTML);
    } else if (isBinary(pastedText)) {
        handleBinary(pastedText);
    } else if (isImage(pastedText)) {
        handleImage(pastedText);
    } else {
        handleText(pastedText);
    }
});
