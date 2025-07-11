// navbar
function openNav() {
    document.getElementById("mySidenav").classList.add("open");
    document.getElementById("main").classList.add("shifted");
}

function closeNav() {
    document.getElementById("mySidenav").classList.remove("open");
    document.getElementById("main").classList.remove("shifted");
}

// search bar
const playlists = [];

const searchInput = document.getElementById('search');
const searchResults = document.getElementById('search-results');

function renderSearchResults(results) {
    if (playlists.length === 0) {
        searchResults.textContent = "You have no playlists, make one!";
    } else if (results.length === 0) {
        searchResults.textContent = "No playlists found.";
    } else {
        searchResults.innerHTML = results.map(pl => `<div>${pl.name}</div>`).join('');
    }
}
searchInput.addEventListener('input', function(){
    const query = this.value.toLowerCase();
    const filtered = playlists.filter(pl => pl.name.toLowerCase().includes(query));
    renderSearchResults(filtered);
});

renderSearchResults(playlists);

// music player

const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    duration = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Lover Girl',
        cover: 'assets/1.jpeg',
        artist: 'Laufey',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'When I\'m In Your Arms',
        cover: 'assets/2.jpeg',
        artist: 'Cleo Sol',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'I Can Love You',
        cover: 'assets/3.jpeg',
        artist: 'Mary J. Blige, Lil\' Kim',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay(){
    if(isPlaying){
        pauseMusic();
    } else {
        playMusic();
    }
};

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song, direction = 0) {
    // Remove any previous animation classes
    image.classList.remove('slide-out-left', 'slide-in-right', 'slide-out-right', 'slide-in-left');
    background.classList.remove('slide-out-left', 'slide-in-right', 'slide-out-right', 'slide-in-left');

    if (direction === 1) {
        image.classList.add('slide-out-left');
        background.classList.add('slide-out-left');
    } else if (direction === -1) {
        image.classList.add('slide-out-right');
        background.classList.add('slide-out-right');
    }

    if (direction === 1 || direction === -1) {
        setTimeout(() => {
            music.src = song.path;
            title.textContent = song.displayName;
            artist.textContent = song.artist;
            image.src = song.cover;
            background.src = song.cover;

            image.classList.remove('slide-out-left', 'slide-out-right');
            background.classList.remove('slide-out-left', 'slide-out-right');
            if (direction === 1) {
                image.classList.add('slide-in-right');
                background.classList.add('slide-in-right');
            } else if (direction === -1) {
                image.classList.add('slide-in-left');
                background.classList.add('slide-in-left');
            }

            setTimeout(() => {
                image.classList.remove('slide-in-right', 'slide-in-left');
                background.classList.remove('slide-in-right', 'slide-in-left');
            }, 400);

            if (isPlaying) {
                playMusic();
            }
        }, 400);
    } else {
        // No animation, just load immediately
        music.src = song.path;
        title.textContent = song.displayName;
        artist.textContent = song.artist;
        image.src = song.cover;
        background.src = song.cover;
    }
}

function changeMusic(direction){
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex], direction);
    isPlaying = true;
    // playMusic();
}

function updateProgressBar(){
    const { duration: songDuration, currentTime } = music;
    const progressPercent =  (currentTime / songDuration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');

    if (songDuration && !isNaN(songDuration)) {
        duration.textContent = `${formatTime(songDuration / 60)}:${formatTime(songDuration % 60)}`;
    }
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar (e){
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;

}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);