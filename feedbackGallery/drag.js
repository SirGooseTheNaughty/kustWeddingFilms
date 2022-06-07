const feedbacks = document.querySelector('.t958__gallery');
const feedbacksBlock = feedbacks.closest('[id^="rec"]');
let startX;
let dragStarted = false;

feedbacks.addEventListener('mousedown', (e) => {
    startX = e.clientX;
});
feedbacks.addEventListener('mouseup', (e) => {
    const diffX = startX - e.clientX;
    if (startX && Math.abs(diffX) > 100) {
        dragStarted = true;
        if (diffX < 0) {
            t958_slide(feedbacksBlock, 'left');
        } else {
            t958_slide(feedbacksBlock, 'right');
        }
    }
    startX = null;
});
feedbacks.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
});
feedbacks.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (startX && Math.abs(diffX) > 100) {
        dragStarted = true;
        if (diffX < 0) {
            t958_slide(feedbacksBlock, 'left');
        } else {
            t958_slide(feedbacksBlock, 'right');
        }
    }
    startX = null;
});
feedbacks.addEventListener('click', (e) => {
    if (dragStarted) {
        e.preventDefault();
        dragStarted = false;
    }
});