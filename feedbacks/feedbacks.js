
class Feedback {
    constructor(id, link, subs, pinWidth = 3) {
        this.id = id;
        this.subs = subs;
        this.block = document.querySelector('#' + id);
        this.icon = this.block.querySelector('.icon');
        this.track = this.block.querySelector('.tracks');
        this.trackDefault = this.block.querySelector('.track.default');
        this.trackColor = this.block.querySelector('.track.colored');
        // this.link = this.getAudioLink(link);
        this.link = link;
        this.pinWidth = document.documentElement.width > 640 ? pinWidth : 2;
        this.audio = null;

        this.embedAudio.apply(this);
        this.addPins.apply(this);

        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.showProgress = this.showProgress.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.catchPlayEvent = this.catchPlayEvent.bind(this);
        this.catchPauseEvent = this.catchPauseEvent.bind(this);
        this.icon.addEventListener('click', this.togglePlay.bind(this));
        this.track.addEventListener('click', this.changeTime);
        this.track.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.track.addEventListener('mousemove', this.changeTime);
        });
        this.track.addEventListener('mouseup', () => {
            this.track.removeEventListener('mousemove', this.changeTime);
        });
        window.addEventListener('playFeedback', this.catchPlayEvent);
        window.addEventListener('pauseFeedback', this.catchPauseEvent);
        this.audio.onended = () => {
            window.dispatchEvent(this.closeEvent);
            this.pause();
        }
    }

    get pauseEvent() {
        return new CustomEvent('pauseFeedback', { detail: { id: this.id } });
    }

    get playEvent() {
        return new CustomEvent('playFeedback', { detail: { play: true, id: this.id, subs: this.subs, audio: this.audio } });
    }

    get closeEvent() {
        return new CustomEvent('closeFeedback', { detail: { id: this.id } });
    }

    catchPauseEvent(e) {
        if (this.audio && e.detail.id === this.id && !this.audio.paused) {
            this.pause();
        }
    }

    catchPlayEvent(e) {
        if (this.audio) {
            if (e.detail.id === this.id && this.audio.paused) {
                return this.play();
            }
            if (e.detail.id !== this.id && !this.audio.paused) {
                return this.pause();
            }
        }
    }

    getAudioLink(link) {
        let playLink = 'https://docs.google.com/uc?export=download&id=';
    
        try {
            const audioId = link.split('d/')[1].split('/')[0];
            playLink += audioId;
            return playLink;
        } catch(e) {
            this.icon.classList.add('error');
            console.error('Не получилось выделить ссылку на файл');
            return null;
        }
    }

    embedAudio() {
        const audioTag = `<audio id="${this.id}-audio" class="feedback-audio"><source src="${this.link}" type="audio/mpeg"></audio>`;
        $('body').append(audioTag);
        this.audio = document.querySelector(`#${this.id}-audio`);
    }

    addPins() {
        const width = this.track.offsetWidth;
        const pinNumber = Math.floor((width + this.pinWidth) / (2 * this.pinWidth));
        this.trackDefault.innerHTML = '';
        this.trackColor.innerHTML = '';
        for (let i = 0; i < pinNumber; i++) {
            const pin1 = document.createElement('span');
            const pin2 = document.createElement('span');
            let pinHeight = Math.floor(Math.random() * 100);
            if (pinHeight < 30) {
                pinHeight += 30;
            }
            if (this.pinWidth !== 3) {
                pin1.style.width = this.pinWidth + 'px';
                pin2.style.width = this.pinWidth + 'px';
                pin1.style.marginRight = this.pinWidth + 'px';
                pin2.style.marginRight = this.pinWidth + 'px';
            }
            pin1.style.height = pinHeight + '%';
            pin2.style.height = pinHeight + '%';
            this.trackDefault.appendChild(pin1);
            this.trackColor.appendChild(pin2);
        }
    }

    play() {
        this.audio.play()
            .then(() => {
                this.block.classList.remove('paused');
                this.block.classList.add('playing');
                this.icon.classList.remove('play');
                this.icon.classList.add('pause');
                this.showProgress();
            })
            .catch(console.error);
    }

    pause() {
        this.audio.pause();
        this.block.classList.remove('playing');
        this.block.classList.add('paused');
        this.icon.classList.remove('pause');
        this.icon.classList.add('play');
    }

    togglePlay() {
        if (this.audio.paused) {
            window.dispatchEvent(this.playEvent);
        } else {
            window.dispatchEvent(this.pauseEvent);
        }
    }

    showProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.trackColor.style.clipPath = `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`;
        !this.audio.paused && requestAnimationFrame(this.showProgress);
    }

    changeTime(e) {
        e.preventDefault();
        const progress = e.layerX / this.track.offsetWidth;
        this.audio.currentTime = this.audio.duration * progress;
        this.showProgress();
    }
}