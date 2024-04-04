let songs;
let currentIndex;
let currentSong;
let previousVolume;
let volumeIcon;
let volumeRange;
let currFolder;

async function getsongs(folder) {
 currFolder = folder;
let a = await fetch(`https://abhrajit-debnath.github.io/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    console.log('Element Href:', element.href);
    if (element.href.endsWith(".mp3")) {
        // let splitvalue=(element.href.split(`/${folder}/`)[1])
        // console.log(splitvalue);
            // songs.push(decodeURIComponent(element.href.split("/").pop().replace(".mp3", "").replace(/%20/g, " ")))
            songs.push(element.href);
        
    }
}

console.log('Songs Array:', songs); // Check the songs array
  let songList = document.querySelector(".song-list ul");
  songList.innerHTML = "";
  for (const songUrl of songs) {
    console.log('Song URL:', songUrl);
    const songName = decodeURIComponent(
      songUrl.split("/").pop().replace(".mp3", "").replace(/%20/g, " ")
    );
    let li = document.createElement("li");

    li.innerHTML = `
      <img class="invert" src="images/music.svg" alt="">
      <div class="info flex">
        <div>${songName}</div>
        <div>Abhrajit Debnath</div>
      </div>
      <div class="play-now flex align-center justify-center">
        <span>play now</span>
        <img class="invert play-btn" src="images/play-song.svg" alt="" srcset="">
      </div>`;
    songList.appendChild(li);

    li.addEventListener("click", () => {
      currentIndex = songs.indexOf(songUrl);
      playmusic(songUrl);
      setTimeout(() => {
        document.querySelector(".right-sidebar-box").scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 10);
    });

    li.addEventListener("click", () => {
      document.querySelector(".volume").style.display = "flex";
    });
  }
}

let play = document.getElementById("play");
play.addEventListener("click", () => {
  if (currentSong && !currentSong.paused) {
    currentSong.pause();
    play.src = "/images/play-song.svg";
  } else if (currentSong) {
    currentSong.play();
    play.src = "/images/pause.svg";
  }
});

let nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
  volumeIcon.src = "images/volume.svg";
  currentIndex++;
  if (currentIndex < songs.length) {
    playmusic(songs[currentIndex]);
  } else {
    currentIndex = 0;
    playmusic(songs[currentIndex]);
  }
});

let previousButton = document.querySelector("#previous");
previousButton.addEventListener("click", () => {
  currentIndex--;
  if (currentIndex >= 0) {
    playmusic(songs[currentIndex]);
  } else {
  }
});

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left-sidebar-box").style.left = "0%";
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left-sidebar-box").style.left = "-200%";
});

const playmusic = (songUrl) => {
  console.log('Playing Song:', songUrl);
  if (currentSong) {
    currentSong.pause();
  }

  currentSong = new Audio(songUrl);
  
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", (e) => {
      let value = parseInt(e.target.value);
      currentSong.volume = value / 100;
    });
  });
  let range = document
    .querySelector(".volume")
    .getElementsByTagName("input")[0];
  range.value = 100;

  document.querySelector(".circle").style.left = 0;
  currentSong.play();
  play.src = "/images/pause.svg";
  document.querySelector(".song-info").innerHTML = decodeURIComponent(
    songUrl.split("/").pop().replace(".mp3", "").replace(/%20/g, " ")
  );
  document.querySelector(".song-time").innerHTML = "";

  currentSong.addEventListener("timeupdate", () => {
    const currentTimeDisplay = document.querySelector(".song-time");
    const currentSeconds = Math.floor(currentSong.currentTime);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = Math.floor(currentSeconds % 60);
    const totalSeconds = Math.floor(currentSong.duration);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalSecondsRemainder = Math.floor(totalSeconds % 60);

    currentTimeDisplay.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")} / ${totalMinutes}:${totalSecondsRemainder
        .toString()
        .padStart(2, "0")}`;

    const percent = (currentSong.currentTime / currentSong.duration) * 100;

    document.querySelector(".circle").style.left = percent + "%";
});


  currentSong.addEventListener("ended", () => {
    currentIndex++;
    if (currentIndex < songs.length) {
      playmusic(songs[currentIndex]);
    } else {
      currentIndex = 0;
      playmusic(songs[currentIndex]);
    }
  });

  setTimeout(() => {
    currentSong.dispatchEvent(new Event("timeupdate"));
  }, 10);
};

let isDragging = false;

document.querySelector(".seekbar").addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const seekbar = document.querySelector(".seekbar");
    const rect = seekbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentSong.currentTime = currentSong.duration * percent;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

async function displayalbums() {
 let a = await fetch(`https://abhrajit-debnath.github.io/songs/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let card_container = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
     let folder=(e.href.split("/").slice(-1)[0].replace("%20", " "));
      let a = await fetch(`songs/${folder}/info.json`)
           let response = await a.json();   
           card_container.innerHTML = card_container.innerHTML + ` <div data-folder="${folder}" class="card">
           <div class="play">
               <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                   <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                       stroke-linejoin="round" />
               </svg>
           </div>

           <img src="/songs/${folder}/cover.jpg" alt="">
           <h2>${response.title}</h2>
           <p>${response.description}</p>
       </div>`
       }
  }
  Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", async (event) => {
        let selectedFolder = event.currentTarget.getAttribute("data-folder");
        console.log("Selected Folder:", selectedFolder);
        await getsongs(`songs/${selectedFolder}`);
        playmusic(songs[0])
    });
});

  }

async function main() {
  await getsongs("songs/kk");

  await displayalbums();
}
main();


const handleLiClick = () => {
  document.querySelector(".playbar").style.height = "118px";
};

let liList = document.querySelectorAll(".song-list>li");

liList.forEach((li) => {
  li.addEventListener("click", handleLiClick);
});

const mediaQuery = window.matchMedia("(max-width: 733px)");

const handleMediaQuery = (mediaQuery) => {
  if (mediaQuery.matches) {
    document.querySelector(".playbar").style.height = "163px";
  } else {
    document.querySelector(".playbar").style.height = "";
  }
};

handleMediaQuery(mediaQuery);

mediaQuery.addListener(handleMediaQuery);

volumeIcon = document.querySelector(".volume>img");

volumeIcon.addEventListener("click", toggleVolume);

function toggleVolume() {
  let volumeRange = document.querySelector(".volume input[type='range']");

  if (currentSong.volume === 0) {
    currentSong.volume = previousVolume ?? 1;
    volumeRange.value = currentSong.volume * 100;

    if (currentSong.volume <= 0.4) {
      volumeIcon.src = "images/lowvolume.svg";
    } else {
      volumeIcon.src = "images/volume.svg";
    }
  } else {
    previousVolume = currentSong.volume;
    currentSong.volume = 0;
    volumeIcon.src = "images/mute.svg";
    volumeRange.value = 0;
  }
}

volumeRange = document.querySelector(".volume input[type='range']");
volumeRange.addEventListener("input", () => {
  if (volumeRange.value == 0) {
    volumeIcon.src = "images/mute.svg";
  } else if (volumeRange.value <= 40) {
    volumeIcon.src = "images/lowvolume.svg";
  } else {
    volumeIcon.src = "images/volume.svg";
  }
});


// let songs;
// let currentIndex;
// let currentSong;
// let previousVolume;
// let volumeIcon;
// let volumeRange;
// let currFolder;

// async function getSongs(folder) {
//     currFolder = folder;
//     let encodedFolder = encodeURI(folder);
//     try {
//       let response = await fetch(`https://abhrajit-debnath.github.io/${encodedFolder}/`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         let text = await response.text();
//         let div = document.createElement("div");
//         div.innerHTML = text;
//         let as = div.getElementsByTagName("a");
//         songs = [];
//         for (let index = 0; index < as.length; index++) {
//             const element = as[index];
//             console.log('Element Href:', element.href);
//             if (element.href.endsWith(".mp3")) {
//                 // songs.push(decodeURIComponent(element.href.split("/").pop().replace(".mp3", "").replace(/%20/g, " ")));
//                 songs.push(element.href);
//             }
//         }
//         console.log('Songs Array:', songs);
//         let songList = document.querySelector(".song-list ul");
//         songList.innerHTML = "";
        
//         for (const songUrl of songs) {
          
//             console.log('Song URL:', songUrl);
//             const songName = decodeURIComponent(songUrl.split("/").pop().replace(".mp3", "").replace(/%20/g, " "));
//             let li = document.createElement("li");
            

//             li.innerHTML = `
//                 <img class="invert" src="images/music.svg" alt="">
//                 <div class="info flex">
//                     <div>${songName}</div>
//                     <div>Abhrajit Debnath</div>
//                 </div>
//                 <div class="play-now flex align-center justify-center">
//                     <span>play now</span>
//                     <img class="invert play-btn" src="images/play-song.svg" alt="" srcset="">
//                 </div>`;
//             songList.appendChild(li);

//             li.addEventListener("click", () => {
//                 currentIndex = songs.indexOf(songUrl);
//                 console.log(songUrl);
                
//                 playMusic(songUrl);
//                 setTimeout(() => {
//                     document.querySelector(".right-sidebar-box").scrollTo({
//                         top: document.body.scrollHeight,
//                         behavior: "smooth",
//                     });
//                 }, 10);
//             });

//             li.addEventListener("click", () => {
//                 document.querySelector(".volume").style.display = "flex";
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching songs:', error);
//         // Handle the error (e.g., display an error message)
//     }
//     return songs;
// }


// const playMusic = (songUrl) => {
//   console.log('Playing Song:', songUrl);
//   console.log('Original songUrl:', songUrl);
  
  
//   if (currentSong && !currentSong.paused) {
//     currentSong.pause();
// }

// currentSong = new Audio(songUrl);
// console.log('New currentSong:', currentSong);
// console.log('currentSong src:', currentSong.src);

  


//   currentSong.addEventListener("loadedmetadata", () => {
//       let currentTimeDisplay = document.querySelector(".song-time");
//       if (currentTimeDisplay) {
//           currentTimeDisplay.textContent = "0:00 / " + formatTime(currentSong.duration);
//       }
//   });

//   document.querySelectorAll("input").forEach((input) => {
//       input.addEventListener("change", (e) => {
//           let value = parseInt(e.target.value);
//           currentSong.volume = value / 100;
//       });
//   });
//   let range = document.querySelector(".volume").getElementsByTagName("input")[0];
//   if (range) {
//       range.value = 100;
//   }

//   document.querySelector(".circle").style.left = 0;
//   currentSong.play();
//   play.src = "/images/pause.svg";
//   document.querySelector(".song-info").innerHTML = decodeURIComponent(
//       songUrl.split("/").pop().replace(".mp3", "").replace(/%20/g, " ")
//   );
//   document.querySelector(".song-time").innerHTML = "";

//   currentSong.addEventListener("timeupdate", () => {
//       let currentTimeDisplay = document.querySelector(".song-time");
//       if (currentTimeDisplay) {
//           currentTimeDisplay.textContent = formatTime(currentSong.currentTime) + " / " + formatTime(currentSong.duration);
//       }
//       let percent = (currentSong.currentTime / currentSong.duration) * 100;
//       document.querySelector(".circle").style.left = percent + "%";
//   });

//   currentSong.addEventListener("ended", () => {
//       currentIndex++;
//       if (currentIndex < songs.length) {
//           playMusic(songs[currentIndex]);
//       } else {
//           currentIndex = 0;
//           playMusic(songs[currentIndex]);
//       }
//   });

//   setTimeout(() => {
//       currentSong.dispatchEvent(new Event("timeupdate"));
//   }, 10);
// };












// let play = document.getElementById("play");
// play.addEventListener("click", () => {
//     if (currentSong && !currentSong.paused) {
//         currentSong.pause();
//         play.src = "/images/play-song.svg";
//     } else if (currentSong) {
//         currentSong.play();
//         play.src = "/images/pause.svg";
//     }
// });

// let nextButton = document.querySelector("#next");
// nextButton.addEventListener("click", () => {
//     volumeIcon.src = "images/volume.svg";
//     currentIndex++;
//     if (currentIndex < songs.length) {
//         playMusic(songs[currentIndex]);
//     } else {
//         currentIndex = 0;
//         playMusic(songs[currentIndex]);
//     }
// });

// let previousButton = document.querySelector("#previous");
// previousButton.addEventListener("click", () => {
//     currentIndex--;
//     if (currentIndex >= 0) {
//         playMusic(songs[currentIndex]);
//     } else {
//         // Handle reaching the first song
//     }
// });

// document.querySelector(".hamburger").addEventListener("click", () => {
//     document.querySelector(".left-sidebar-box").style.left = "0%";
// });

// document.querySelector(".close").addEventListener("click", () => {
//     document.querySelector(".left-sidebar-box").style.left = "-200%";
// });



// const formatTime = (timeInSeconds) => {
//     let minutes = Math.floor(timeInSeconds / 60);
//     let seconds = Math.floor(timeInSeconds % 60);
//     return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
// };

// async function displayAlbums() {
//     try {
//         let response = await fetch(`https://abhrajit-debnath.github.io/songs/`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         let text = await response.text();
//         let div = document.createElement("div");
//         div.innerHTML = text;
//         let anchors = div.getElementsByTagName("a");
//         let cardContainer = document.querySelector(".card-container");
//         let array = Array.from(anchors);
//         for (let index = 0; index < array.length; index++) {
//             const e = array[index];
//             if (e.href.includes("/songs/")) {
//                 let folder = (e.href.split("/").slice(-1)[0].replace("%20", " "));
//                 let infoResponse = await fetch(`songs/${folder}/info.json`);
//                 if (!infoResponse.ok) {
//                     throw new Error(`HTTP error! status: ${infoResponse.status}`);
//                 }
//                 let infoData = await infoResponse.json();
//                 cardContainer.innerHTML += ` <div data-folder="${folder}" class="card">
//                     <div class="play">
//                         <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
//                             xmlns="http://www.w3.org/2000/svg">
//                             <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//                                 stroke-linejoin="round" />
//                         </svg>
//                     </div>
//                     <img src="/songs/${folder}/cover.jpg" alt="">
//                     <h2>${infoData.title}</h2>
//                     <p>${infoData.description}</p>
//                 </div>`;
//             }
//         }
//         document.querySelectorAll(".card").forEach(card => {
//             card.addEventListener("click", async (event) => {
//                 let selectedFolder = event.currentTarget.getAttribute("data-folder");
//                 console.log("Selected Folder:", selectedFolder);
//                 await getSongs(`songs/${selectedFolder}`);
//             });
//         });
//     } catch (error) {
//         console.error('Error displaying albums:', error);
//         // Handle the error (e.g., display an error message)
//     }
// }

// async function main() {
//     await getSongs("songs/kk");
//     await displayAlbums();
// }

// main();

// const handleLiClick = () => {
//     document.querySelector(".playbar").style.height = "118px";
// };

// document.querySelectorAll(".song-list>li").forEach((li) => {
//     li.addEventListener("click", handleLiClick);
// });

// const mediaQuery = window.matchMedia("(max-width: 733px)");

// const handleMediaQuery = (mediaQuery) => {
//     if (mediaQuery.matches) {
//         document.querySelector(".playbar").style.height = "163px";
//     } else {
//         document.querySelector(".playbar").style.height = "";
//     }
// };

// handleMediaQuery(mediaQuery);
// mediaQuery.addListener(handleMediaQuery);

// volumeIcon = document.querySelector(".volume>img");
// volumeIcon.addEventListener("click", toggleVolume);

// function toggleVolume() {
//     let volumeRange = document.querySelector(".volume input[type='range']");
//     if (currentSong.volume === 0) {
//         currentSong.volume = previousVolume ?? 1;
//         volumeRange.value = currentSong.volume * 100;
//         volumeIcon.src = currentSong.volume <= 0.4 ? "images/lowvolume.svg" : "images/volume.svg";
//     } else {
//         previousVolume = currentSong.volume;
//         currentSong.volume = 0;
//         volumeIcon.src = "images/mute.svg";
//         volumeRange.value = 0;
//     }
// }

// volumeRange = document.querySelector(".volume input[type='range']");
// if (volumeRange) {
//     volumeRange.addEventListener("input", () => {
//         volumeIcon.src = volumeRange.value == 0 ? "images/mute.svg" : volumeRange.value <= 40 ? "images/lowvolume.svg" : "images/volume.svg";
//     });
// }

















