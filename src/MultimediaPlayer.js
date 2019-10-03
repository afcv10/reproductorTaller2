class MultimediaPlayer extends DOMGui {

    constructor(audioTagSelector, tracks, guiParams = undefined) {
        super();

        this.audio = document.querySelector(audioTagSelector);
        this._tracks = tracks;
        this.audio.src = this._tracks[0];
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
            areaArrastre:undefined
        }
        this.setDOMElements(guiParams);
        this.addListeners();
        this.setPlayerInfo();
    }

    set tracks(value){
        this._tracks = value;
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
            this.restaureButton();
        });

        this.addButtonListener('next',
        () => {
            this.changePlayingSong(this.currentTrack + 1);
            this.restaureButton();
        });

        this.addButtonListener('barra',
        (e) => {
            let position = e.offsetX;
            let totalW = e.target.clientWidth;
            let progress = position / totalW;
            this.updateProgressBar(progress);
            this.audio.currentTime = this.audio.duration * progress;
        });
        this._DOMElements.areaArrastre.ondrop=(e) =>{
            e.preventDefault();
            let files= e.dataTransfer.files;
            
            for (const file of files) {
                let reader  = new FileReader();
                let readerBuffer  = new FileReader();
                //InfoAudio
                let title="";
                let artist="";
                let audio=null;
                //carga el archivo
                reader.onloadend = (e) => {
                    audio= e.target.result;
                    this.cargarDatosCancion(audio,artist,title);
                    console.log("audio");
                }
                //carga metadatos
                readerBuffer.onload = (e) => {
                    let arrayBuffer = e.target.result;
                    var dataView = new DataView(arrayBuffer)
                    console.log(dataView.byteLength);
                    let tamMetadata=dataView.byteLength-128;
                    title=this.readString(dataView, tamMetadata+3, 30);
                    artist=this.readString(dataView, tamMetadata+33, 30);
                    if (artist=="" || title=="") {
                        title="?";
                        artist="?";
                    }
                    this.cargarDatosCancion(audio,artist,title);
                    console.log("metadata");
                }
                if (file) {
                    reader.readAsDataURL(file);
                    readerBuffer.readAsArrayBuffer( file);
                } 
            }
        };
        this._DOMElements.areaArrastre.ondragover=function(e){
            e.preventDefault();
         };
         
    }

    addButtonListener(btnName, callback){
        this._DOMElements[btnName].onclick = callback;
    }

    changePlayingSong(index) {
        console.log("que paso");
        if (index<0){
            this.currentTrack = 0;
        }else if  ( index <= this._tracks.length - 1 ) {
            this.currentTrack = index;
        }else{
            this.currentTrack = 0;
        }
        this.audio.src = this._tracks[this.currentTrack];
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
    readString(dataView, offset, length) {
        let o = '';
        for (let i = offset; i < offset + length; i++) {
            o +=String.fromCharCode(dataView.getUint8(i));
        }
        return o;
    }
    cargarDatosCancion(audio, artist,title) {
        if (audio==null || artist=="" || title=="") {
            return;
        }
        let listaReproduccion=this._DOMElements.playlistMenu;
        let elemento=`<li class='trackLi'><a class='track' href='${audio}'><span class='title'>${title}</span> - <span class='artist'>${artist}</span></a> <span class='time'>3:27</span></li>`;
        listaReproduccion.innerHTML=listaReproduccion.innerHTML+elemento;
        this._tracks.push(audio);
        this._DOMElements.tracks=document.querySelectorAll('.trackLi');
        this._DOMElements.tracks.forEach((track,index) => {
            track.onclick=() => {
                this.changePlayingSong(index);
            };
        });
        
    }
}