// Extract the file parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');

if (!file) {
    alert('No PDF file specified in the URL.');
    throw new Error('No PDF file specified.');
}

// Set the src of the iframe to the PDF file
const pdfViewer = document.getElementById('pdf-viewer');
pdfViewer.src = `/qp/AL/${file}`;
