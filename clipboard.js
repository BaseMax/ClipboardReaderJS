// Functions
function handleText(text) {
    document.getElementById('output').innerHTML = `Plain Text detected: <pre>${text}</pre>`;
}

function handleHTML(html) {
    document.getElementById('output').innerHTML = `HTML detected: <pre>${html}</pre>`;
}

function handleFiles(files) {
    let outputHTML = 'Files detected: <ul>';
    for (const file of files) {
        outputHTML += `<li>${file.name} (Type: ${file.type}, Size: ${file.size} bytes)</li>`;
    }
    outputHTML += '</ul>';
    document.getElementById('output').innerHTML = outputHTML;
}

function handleImage(data) {
    const image = new Image();
    image.src = data;
    image.onload = () => {
        document.getElementById('output').innerHTML = `Image detected: <img src="${data}" alt="Pasted Image" />`;
    };
}

function handleBinary(binaryData) {
    document.getElementById('output').innerHTML = `Binary detected: <pre>${binaryData}</pre>`;
}

function isBinary(text) {
    return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text);
}

function isImage(text) {
    const imagePattern = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    return imagePattern.test(text);
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
