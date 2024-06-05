const urlParams = new URLSearchParams(window.location.search);
const fileName = urlParams.get('file');
const fileLevel = urlParams.get('level');

if (!fileName) {
    alert('No PDF file specified in the URL.');
    throw new Error('No PDF file specified.');
}
if (screen.width <= 699) {
    window.location.replace(`../qp/${fileLevel + '/' + fileName}`);
}
// Set the src of the iframe to the PDF file
const pdfViewer = document.getElementById('pdf-viewer');
pdfViewer.src = `../qp/AL/${fileName}`;