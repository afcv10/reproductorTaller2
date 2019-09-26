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
});

let a = document.querySelector('#areaArrastre');
a.ondrop=function(e){
    e.preventDefault();
    let files= e.dataTransfer.files;
    let listaReproduccion=document.querySelector("#listaReproduccion");
    for (const file of files) {
        //console.log(file);
        var reader  = new FileReader();
        reader.onloadend = function (e) {
            audio= e.target.result;
            let elemento=`<li class='trackLi'><a class='track' href='${audio}'><span class='title'>What Is Love</span> - <span class='artist'>James Young</span></a> <span class='time'>3:27</span></li>`;
            listaReproduccion.innerHTML=listaReproduccion.innerHTML+elemento;
            tracks.push(audio);
        }
        if (file) {
            reader.readAsDataURL(file);
        } 

    }
    
};
a.ondragover=function(e){
    e.preventDefault();
 };