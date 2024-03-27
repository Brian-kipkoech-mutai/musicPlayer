  const searchIcon=document.getElementById('searchIcon')
  const searchInput=document.getElementById('searchInput')
  const appName=document.getElementById('appName')
  const header_elements=document.getElementById('header-elements')
  const search_container=document.getElementById('search-container')
  const play_shuffle_controls=document.getElementById('play_shuffle_controls')
  const songsDsiplay=document.getElementById('songsDsiplay')
  const playOrPauseText=document.getElementById('playOrPauseText')
//   const PlayButton=document.getElementById('PlayButton')
   const currentSongPlayingDsiplay=document.getElementById('currentSongPlayingDsiplay')
  const topPlayOrpauseButton =document.getElementById('topPlayOrpauseButton')
  const ui =document.getElementById("ui")
   let searchState=false ; 
  let isRepeat=false;
  let fetched=false;


  //
  //
   
  //
  //
    
  const handleProgresBar=()=>{
   
  }

 topPlayOrpauseButton.innerHTML='<i class="fas fa-play"></i> play'

 appName.classList.remove('hideAppName')
 
  const toggleSearchInput=()=>{
    searchInput.classList.toggle('hidden')
     appName.classList.toggle('hideAppName')
     header_elements.style.paddingTop='1.6em'
     header_elements.style.paddingBottom='1.7em'
 
     
     
     if(!searchInput.classList.contains('hidden')){
        //  header_elements.style.justifyContent='center'
        //  header_elements.style.gap='5px'
         search_container.style.width='100%'
         console.log('full search');
         searchIcon.onclick=handleSearch;
      }
     else{
        header_elements.style.justifyContent='space-between'
        search_container.style.width='unset'; 
        header_elements.style.padding='unset';
        header_elements.style.padding='0.2em'
         console.log('display');
         

     }

     function handleSearch(){
      
      const query=searchInput.value;
      console.log('qerry supplid',query)
      fetchMusicByGenre(query);
      searchInput.value=''
      searchState=false;
      searchIcon.onclick=''
       
       
   }
 
     
   
    
  }
  //declaring user data 
  const userData={
    loadedSongs:null,
    currentSongID:null,
    currentSongTime:0,
   }

     //loading  music
     async function fetchMusicByGenre(genre) {
      try {
        // environmental variable
        // const apiKey = process.env.JAMENDO_API_KEY; 
        const apiKey="bb8d9ce6";

          const url = `https://api.jamendo.com/v3.0/tracks/?format=json&limit=${20}&tags=${genre}&client_id=${apiKey}`;
          const response = await fetch(url);
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          updateDomWithMusic(data.results)
          fetched=true;

          
      } catch (error) {
          console.error(`Error fetching data: ${error}`);
          throw error;
      }
  }
    

   function updateDomWithMusic(music) {
      console.log('music',music);
      songsDsiplay.innerHTML=''
   userData.loadedSongs=music;
   

  const mapped= music.map(music => {
       return  `
       <section id="songcontainer${music.id}" class="songContainer" onclick="playMusic(${music.id})">
    <div id="music_image${music.id}" class="music_image"><img src="${music.image}" class="music_image"></div>
    <div class="music_data" id="music-data${music.id}">
        <div class="music_title" id="title${music.id}">${music.album_name}</div>
        <div class="artist_name" id="name${music.id}">${music.artist_name}</div>
    </div>
    <div id="" > <a href="${music.audiodownload}" id="dowload${music.id}" class="dowload_button" ><i class="fas fa-download"></i></a></div>  
    
</section>
  <hr>
`
 

  }).join('');

  songsDsiplay.innerHTML=mapped;
     
   }
    


   const audio =new Audio();
   let isPlaying=false;
  // playing song
   const playMusic=(id)=>{
     if (id) {
        const current =document.getElementById(`music-data${id}`)
        const dowloadButton=document.getElementById(`dowload${id}`)
        const containers= document.querySelectorAll(".music_data")
        const dowloadNodes=document.querySelectorAll('.dowload_button')
        dowloadNodes.forEach((button)=>{
        button.style.color='#8D8D8D'
        })
       containers.forEach((section)=> {
            section.style.color='#FFFFFF'

       })
       console.log('dowloadbtn',dowloadButton);
       dowloadButton.style.color='#D1183E'
       current.style.color="#D1183E" 
     }

   
    console.log('current id',userData?.currentSongID);
    console.log('id clicked',id);
    isPlaying=true
    if(!id ){
    
        console.log('no current song')
        audio.src=userData?.loadedSongs[0]?.audio
         
        audio.play()
        userData.currentSongID=userData?.loadedSongs[0]?.id;
        updateBotomView()
    }
    else if(id==userData?.currentSongID){
        // audio.currentTime=userData?.currentSongTime;
        // playMusic(userData?.currentSongID)
        audio.play()
        handleChangeView(userData?.currentSongID)
       
    }
    else if(id!==userData?.currentSongID){
        console.log('condition c');
    audio.currentTime=0
    const song= userData?.loadedSongs.find((song)=>song.id==id);
    userData.currentSongID=id;
    console.log('song clicked',song)
    audio.src=song?.audio;
    audio.play()
    updateBotomView()
    }
     
    const playOrPauseTopHtml= '<i  class="fas fa-pause"></i> Pause'
    

     topPlayOrpauseButton.innerHTML=playOrPauseTopHtml;
     playOrPauseText.innerText='Pause'
      
   }


   //pausing song
   const findSong=(sogID)=>{
     return userData?.loadedSongs?.find((song)=>song.id==sogID)

   }
   const pauseMusic=()=>{
    
    audio.pause()
    userData.currentSongTime=audio.currentTime;
    const playOrPauseTopHtml='<i class="fas fa-play"></i> play'
     topPlayOrpauseButton.innerHTML=playOrPauseTopHtml
    console.log('isplaying-inside pauseMusic',isPlaying)
    updateBotomView()
   }
const handlePLayeOrpause=()=>{
    if (!fetched){
        return
    }
    else if(!isPlaying){
        playMusic(userData?.currentSongID)
    }
    else{
        isPlaying=false;
        pauseMusic()
        

        console.log('isPlayingtop',isPlaying );
    }
    handleChangeView(userData?.currentSongID) 
   }

   topPlayOrpauseButton.addEventListener('click',handlePLayeOrpause )

   const  fastfoward=()=>{
    audio.currentTime+=10;
   }
   const fastBackwards=()=>{
    audio.currentTime-=10
   }
  const shuffle=()=>{
    userData?.loadedSongs.sort(()=>Math.random()-0.5);
    updateDomWithMusic(userData?.loadedSongs);

  }
  const previous=()=>{
     const song= findSong(userData?.currentSongID)
     const index =userData?.loadedSongs.indexOf(song);
     if(index){
        audio.src=userData?.loadedSongs[index-1].audio
         const id =userData?.loadedSongs[index-1].id;
         userData.currentSongID=userData?.loadedSongs[index-1].id;
        playMusic(id)
        handleChangeView(userData?.currentSongID)
     }
  }
  const next=()=>{

    const song= findSong(userData?.currentSongID)
    const index =userData?.loadedSongs.indexOf(song);
    if(userData?.loadedSongs[userData?.loadedSongs.indexOf(song)+1]){
        audio.src=userData?.loadedSongs[index+1].audio
        const id =userData?.loadedSongs[index+1].id;
        userData.currentSongID=userData?.loadedSongs[index+1].id;
       playMusic(id)  
       handleChangeView(userData?.currentSongID)   
    }

  }
  
  const handleEnded=()=>{
    if(isRepeat){
        audio.currentTime=0;
        playMusic(userData?.currentSongID)
    }
    else{
        next();
         
    
    }
     
  }
  audio.addEventListener("ended",handleEnded)
  
  const repeat=()=>{
    isRepeat=!isRepeat;
    console.log('isrepete',isRepeat)
    handleChangeView(userData?.currentSongID)
  }

  const fall_back=()=>{
    ui.style.background="unset"
    ui.style.backgroundColor="#181818"
    currentSongPlayingDsiplay.classList.remove('bottomSecondary')
    currentSongPlayingDsiplay.classList.add('bottomPrimary')
    songsDsiplay.style.display='flex';
    play_shuffle_controls.style.display='flex';
    header_elements.style.display='flex'

     updateBotomView()
  }
function updateBotomView(){
    
    console.log('isPlayingInsideBoto mView ',isPlaying );
    
    const song= findSong(userData?.currentSongID)
     
    const displayHTML =`
    <div>
    <img id="currentSongImage${userData?.currentSongID}" src="${song?.album_image}" class="currentSogImage" >
</div>
<div id="" class="currentSong-Details"  onclick="handleChangeView('${userData?.currentSongID}')">
    <div id="${song?.album_name}" class="currentSogTitle">${song?.album_name}</div>
    <div id="${song?.artist_name}" class="currentSogArtistName">${song?.artist_name}</div>
</div>
<div id="playOrPauseCurrentSong" onclick="handlePLayeOrpause()">
    ${isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>'}
</div>
    `
     currentSongPlayingDsiplay.innerHTML=displayHTML;
}
      
function handleChangeView(songId){

    console.log('is repeat inside main func',isRepeat);
  const song= userData?.loadedSongs?.find((song)=>song.id==songId)
     songsDsiplay.style.display='none';
     play_shuffle_controls.style.display='none';
     header_elements.style.display='none'
     currentSongPlayingDsiplay.classList.remove('bottomPrimary')
     currentSongPlayingDsiplay.classList.add('bottomSecondary')
     ui.style.background="linear-gradient(#CB183D,#0E0E0E 50%)"
      

     const currentSongdisplayNeWHtml=`
     <div id="fall_back"> 
     <i class="fas fa-chevron-down down-button" onclick="fall_back()" ></i>
 </div>
<div  id="middle_display">
<div id="secondartyImage${song.id}"  >
 <img src=${song.album_image} alt="album_image" srcset="" class="secondary_image">
</div>
<div  class="secondarySongDetails" >
<div id='secondaryViewSongTitle${song.id}' class="secondaryViewSongTitle"><span>${song.album_name}</span> </div>
<div id="secondaryViewArtistname${song.id}" class="secondaryViewArtistName">${song.artist_name}</div>
</div>
</div>
<div id="curetSongDetailsMainView">

 <div id="span_display">
     <section id="fastBackwards" onclick="fastBackwards()"><i class="fas fa-fast-backward"></i></section>
     <section id="currentMusicSpan" ><input type="range" id="progressBar" min="0" value="0"></section>
     <section id="fastFoward" onclick="fastfoward()"><i class="fas fa-fast-forward" ></i></section>
 </div>
 <div id="currentsongsFullControls">

     <section id="secondaryShuffle">
         <i class="fas fa-random" onclick="shuffle()"></i>
     </section>
     
     <section id="previousSong">
         <i class="fas fa-backward" onclick="previous()"></i>
     </section>
     
     <section id="playSecondarySong " onclick="handlePLayeOrpause()">
     ${isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>'}
     </section>
     
     <section id="nextSong">
         <i class="fas fa-forward" onclick="next()" ></i>
     </section>
     
     <section id="repeat">
     ${isRepeat ? '<i class="fas fa-undo" onclick="repeat()"></i>' : '<i class="fas fa-redo" onclick="repeat()"></i>'}
     </section>

 </div>
</div>
     `
    
 currentSongPlayingDsiplay.innerHTML=currentSongdisplayNeWHtml;
 const progressBar=document.getElementById("progressBar")

 progressBar.addEventListener('input',handleRangeInput);
 audio.addEventListener('timeupdate',UpdateProgresBar)
 audio.addEventListener('ended',InstantUpdate)
  
 function UpdateProgresBar(){
    console.log('updating');
    const currentime=audio.currentTime;
    const duration=audio.duration;
    const progress= (currentime/duration)*100;
    progressBar.value=progress
 }
 
  
 
 
 function handleRangeInput(){
  const input=progressBar.value
  const durat= audio.duration
    audio.currentTime= (durat*input)/100;

 }
 function InstantUpdate(){
    progressBar.value
 }

}

 
     
    
  
 

  searchIcon.addEventListener('click',toggleSearchInput)

  