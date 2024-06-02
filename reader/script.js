const urlParams = new URLSearchParams(window.location.search);
const fileName = urlParams.get('file');

let pdfDoc = null;
let pageNum = 1;
let pageIsRendering = false;
let pageNumIsPending = null;
let scale = 1.5;
const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');

const renderPage = num => {
    pageIsRendering = true;
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;
            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        document.getElementById('page-num').textContent = num;
    });
};

const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};

const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

const zoomIn = () => {
    scale += 0.1;
    canvas.style.transform = `scale(${scale})`;
    queueRenderPage(pageNum);
};

const zoomOut = () => {
    if (scale <= 0.5) {
        return;
    }
    scale -= 0.1;
    canvas.style.transform = `scale(${scale})`;
    queueRenderPage(pageNum);
};

const loadPdf = () => {
    const loadingTask = pdfjsLib.getDocument(`../qp/${fileName}`);
    loadingTask.promise.then(pdf => {
        pdfDoc = pdf;
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        renderPage(pageNum);
        renderThumbnails();
    }).catch(error => {
        console.error('Error loading PDF:', error);
    });
};

const renderThumbnails = () => {
    const thumbsContainer = document.getElementById('thumbnails');
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        pdfDoc.getPage(i).then(page => {
            const viewport = page.getViewport({ scale: 0.2 });
            const thumbCanvas = document.createElement('canvas');
            const thumbCtx = thumbCanvas.getContext('2d');
            thumbCanvas.height = viewport.height;
            thumbCanvas.width = viewport.width;
            page.render({ canvasContext: thumbCtx, viewport }).promise.then(() => {
                thumbCanvas.addEventListener('click', () => {
                    pageNum = i;
                    queueRenderPage(pageNum);
                });
                thumbsContainer.appendChild(thumbCanvas);
            });
        });
    }
};

document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.getElementById('next-page').addEventListener('click', showNextPage);
document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);

document.addEventListener('keydown', e => {
    if (e.keyCode === 37) { // Left arrow
        showPrevPage();
    } else if (e.keyCode === 39) { // Right arrow
        showNextPage();
    }
});

loadPdf();
