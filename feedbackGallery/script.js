function parseFeedbackLinks() {
    const block = document.querySelector('#rec409145843');
    const feedbacks = block.querySelectorAll('.t958__card');
    return [...feedbacks].map(feedback => {
        const linksElement = feedback.querySelector('.t958__author-descr');
        if (!linksElement || !linksElement.textContent.length) {
            return { feedback };
        }
        const linksTexts = linksElement.textContent.split(' | ');
        let popup = null, insta = null;
        linksTexts.forEach(text => {
            if (text.includes('popup')) {
                popup = text;
            } else if (text.includes('insta')) {
                insta = text.split('insta:')[1];
            }
        });
        const instaBtnContainer = feedback.querySelector('.t958__avatar');
        return {
            feedback,
            popup,
            insta,
            instaBtnContainer,
            popupBtn: linksElement
        }
    });
}

function placeLinks(feedbackData) {
    feedbackData.forEach(feedback => {
        const { popupBtn, popup, insta, instaBtnContainer } = feedback;
        if (popupBtn) {
            popupBtn.innerHTML = popup ? `<a href="${popup}" class="feedback-video-link">смотреть клип</a>` : '';
            popupBtn.addEventListener('click', (e) => e.stopPropagation());
        }
        if (insta) {
            instaBtnContainer.innerHTML = `<a href="${insta}" target="_blank" class="feedback-insta-link"></a>`;
            instaBtnContainer.addEventListener('click', (e) => e.stopPropagation());
        }
    });
}

(function reformFeedbacks() {
    const data = parseFeedbackLinks();
    placeLinks(data);
})();