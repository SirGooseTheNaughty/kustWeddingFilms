class Subtitler {
    constructor() {
        this.lines;
        this.audio;
        this.id;
        this.cont = null;
        this.textCont = null;
        this.playPauseIcon = null;
        this.closeIcon = null;
        this.isPlaying = false;
        this.timeout = null;

        this.getCurrentElements = this.getCurrentElements.bind(this);
        this.getCurrentText = this.getCurrentText.bind(this);
        this.updateText = this.updateText.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.close = this.close.bind(this);
        this.playPause = this.playPause.bind(this);
        this.catchPlayEvent = this.catchPlayEvent.bind(this);
        this.catchPauseEvent = this.catchPauseEvent.bind(this);

        this.findContainer.apply(this);

        window.addEventListener('playFeedback', this.catchPlayEvent);
        window.addEventListener('pauseFeedback', this.catchPauseEvent);
        window.addEventListener('closeFeedback', this.close);
    }

    get pauseEvent() {
        return new CustomEvent('pauseFeedback', { detail: { id: this.id } });
    }

    get playEvent() {
        return new CustomEvent('playFeedback', { detail: { id: this.id } });
    }

    catchPlayEvent(event) {
        if (event.detail.audio) {
            this.audio = event.detail.audio;
        }
        if (event.detail.subs) {
            this.lines = event.detail.subs;
        }
        if (event.detail.id) {
            this.id = event.detail.id;
        }
        this.play();
    }

    catchPauseEvent(event) {
        if (event.detail.id === this.id) {
            this.pause();
        }
    }

    findContainer() {
        this.cont = document.querySelector('.subtitle');
        this.cont.classList.add('transition');
        this.textCont = this.cont.querySelector('.subtitle__text');
        this.playPauseIcon = this.cont.querySelector('.subtitle__controls');
        this.closeIcon = this.cont.querySelector('.subtitle__close');

        this.playPauseIcon.addEventListener('click', this.playPause);
        this.closeIcon.addEventListener('click', this.close);
    }

    play() {
        this.isPlaying = true;
        this.cont.classList.add('shown');
        this.updateText();
        this.playPauseIcon.classList.remove('play');
        this.playPauseIcon.classList.add('pause');
    }

    pause() {
        this.isPlaying = false;
        clearTimeout(this.timeout);
        this.playPauseIcon.classList.add('play');
        this.playPauseIcon.classList.remove('pause');
    }

    close() {
        if (this.isPlaying) {
            this.pause();
            window.dispatchEvent(this.pauseEvent);
        }
        this.cont.classList.remove('shown');
    }

    playPause() {
        if (this.isPlaying) {
            window.dispatchEvent(this.pauseEvent);
        } else {
            window.dispatchEvent(this.playEvent);
        }
    }

    updateText() {
        const text = this.getCurrentText();
        if (this.textCont.textContent !== text) {
            this.textCont.textContent = text;
        }
        if (this.isPlaying) {
            this.timeout = setTimeout(this.updateText, 150);
        }
    }

    getCurrentText() {
        const elements = this.getCurrentElements();
        return elements.reduce((text, el) => text += el.text, '');
    }

    getCurrentElements() {
        const time = this.audio.currentTime;
        let appropriateElements = [];
        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];

            if (line.time >= time) {
                return appropriateElements;
            }
            
            if (line.break) {
                appropriateElements = [];
            } else {
                appropriateElements.push(line);
            }
        }
        return appropriateElements;
    }
}