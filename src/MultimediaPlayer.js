class MultimediaPlayer extends DOMGui {

    constructor(audioTagSelector, tracks, guiParams = undefined) {
        super();

        this.audio = document.querySelector(audioTagSelector);
        this.tracks = tracks;
        this.audio.src = this.tracks[0];
        this.currentTrack = 0;
        

        this._DOMElements = {
            play: undefined,
            next: undefined,
            prev: undefined,
            title: undefined,
            artist: undefined,
            album: undefined,
            cover: undefined,
            duracion:undefined,
            duracionActual: undefined,
            currentTime: undefined,
            totalTime: undefined,
            playlistMenu: undefined,
            progressBar: undefined,
            barra: undefined,
            tracks: undefined,
        }
        this.setDOMElements(guiParams);
        this.addListeners();
        this.setPlayerInfo();
    }
    restaureButton(){
        this._DOMElements.play.children[0].classList.remove('visible');
        this._DOMElements.play.children[1].classList.remove('visible');
        this._DOMElements.play.children[1].classList.add('visible');
    }
    addListeners() {
        

        this.startTimeUpdateListener();

        this._DOMElements.tracks.forEach((track,index) => {
            track.onclick=() => {
                this.changePlayingSong(index);
            };
        });
        
        this.addButtonListener('play',
        () => {
            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause();
            }
            console.log( this._DOMElements.play.children);
            this._DOMElements.play.children[0].classList.toggle('visible');
            this._DOMElements.play.children[1].classList.toggle('visible');
        });

        this.addButtonListener('prev',
        () => {
            this.changePlayingSong(this.currentTrack - 1);
            // this.restaureButton();
        });

        this.addButtonListener('next',
        () => {
            this.changePlayingSong(this.currentTrack + 1);
            // this.restaureButton();
        });

        this.addButtonListener('barra',
        (e) => {
            let position = e.offsetX;
            let totalW = e.target.clientWidth;
            let progress = position / totalW;
            this.updateProgressBar(progress);
            this.audio.currentTime = this.audio.duration * progress;
        });
    }

    addButtonListener(btnName, callback){
        this._DOMElements[btnName].onclick = callback;
    }

    changePlayingSong(index) {
        console.log("mda"+ index);
        if (index<0){
            this.currentTrack = 0;
        }else if  ( index <= this.tracks.length - 1 ) {
            this.currentTrack = index;
        }else{
            this.currentTrack = 0;
        }
        this.audio.src = this.tracks[this.currentTrack];
        this.audio.play();
        let playing = this._DOMElements.playlistMenu.querySelector('.playing');
        playing.classList.remove('playing');
        let element = this._DOMElements.playlistMenu.children[this.currentTrack];
        element.classList.add('playing');
        this.setPlayerInfo();
    }

    setPlayerInfo() {
        let element = this._DOMElements.playlistMenu.children[this.currentTrack];
        this._DOMElements.title.innerHTML = element.querySelector('.title').innerHTML;
        this._DOMElements.artist.innerHTML = element.querySelector('.artist').innerHTML;
        this._DOMElements.duracion.innerHTML = element.querySelector('.time').innerHTML;
    }

    startTimeUpdateListener() {
        this.audio.ontimeupdate = () => {
            let total = this.audio.duration;
            let current = Math.floor(this.audio.currentTime);
            console.log(current);
            let progress = (current / total)*100;
            this.updateProgressBar(progress);
            let minutos=parseInt(current/60);
            let segundos = current>60?current-(minutos*60):current;
            this._DOMElements.duracionActual.innerHTML = (minutos)+":"+(parseInt(segundos)<10?"0"+parseInt(segundos):parseInt(segundos));
        }
    }

    updateProgressBar(progress) {
        this._DOMElements.progressBar.style.width = `${progress}%`;
    }
}