let tracks = [];
let content = document.querySelector('#content');
let playlist = document.querySelector('#playlist');

let trackElements = document.getElementsByClassName('track');
for (let i = 0; i < trackElements.length; i++) {
    tracks.push(trackElements[i].href);
}

var menu = document.querySelector('.menu');
menu.onclick = () => { 
    content.classList.toggle('show');
    playlist.classList.toggle('show') 
};

let myAudioPlayer = new MultimediaPlayer('#content audio', tracks, {
    play: document.querySelector('#playpause'),
    next: document.querySelector('#next'),
    prev: document.querySelector('#previus'),
    title: document.querySelector('#title'),
    artist: document.querySelector('#artist'),
    album: document.querySelector('#album'),
    cover: document.querySelector('#albumImg'),
    duracion: document.querySelector('#duracion'),
    duracionActual: document.querySelector('#duracionActual'),
    playlistMenu: document.querySelector('#listaReproduccion'),
    progressBar: document.querySelector('.cargaBarra'),
    barra: document.querySelector('.barra'),
    tracks: document.querySelectorAll('.trackLi'),
    areaArrastre:document.querySelector('#areaArrastre')
});
