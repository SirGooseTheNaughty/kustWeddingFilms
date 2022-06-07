(function useQuizClicker() {
    const quizForm = document.querySelector('.t835__quiz');
    let clickTimeout;

    quizForm.addEventListener('click', handleClick);

    function handleClick(e) {
        clearTimeout(clickTimeout);
        if (e.target.closest('.t835__btn_next') || e.target.closest('.t835__btn_result')) {
            clickTimeout = setTimeout(clickSubmit, 50);
        }
    }

    function clickSubmit() {
        const btn = quizForm.querySelector('.t-form__submit');
        if (btn && getComputedStyle(btn).display !== 'none') {
            btn.firstElementChild.click();
        }
    }
})();