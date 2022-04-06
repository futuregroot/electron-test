import React, { Component } from 'react';
import VideoPlayer from './VideoPlayer';


const { ipcRenderer } = window.require('electron');

const getMovies = (category_id, page) => dispatch => {
    ipcRenderer.send('getMovies', { category_id, page });
    ipcRenderer.on('movies', (event, { movies, maxPage, FOLDER_PATH }) => {
       
    });
};


function Player({videoSrc}){
    const playerRef = React.useRef(null);

    const videoJsOptions = { // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        //fluid to fill the cointainer
        fluid: true,
        // native control for touch devices
        nativeControlsForTouch: true,

        controlBar: {
            fullscreenToggle: false,
            // volumePanel: {inline: true},
            // children: [
            //     'playToggle',
            //     'volumePanel',
            //     'volumeBar',
            //     'currentTimeDisplay',
            //     'timeDivider',
            //     'durationDisplay',
            //     'progressControl',
            //     'liveDisplay',
            //     'remainingTimeDisplay',
            //     'customControlSpacer',
            //     'playbackRateMenuButton',
            //
            // ]
        },
        sources: [{
        src: videoSrc,
        type: 'video/mp4'
        }]
    }

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // you can handle player events here
        player.on('waiting', () => {
        console.log('player is waiting');
        });

        player.on('dispose', () => {
        console.log('player will dispose');
        });
    };
    React.useEffect(()=>{


        // ipcRenderer.send('getMovies', { category_id, page });
        // ipcRenderer.on('movies', (event, { movies, maxPage, FOLDER_PATH }) => {
            
        // });

    },[]);
    return (
        <div style={{height: '100%'}}>
            <div style={{ height: '100%', zIndex: 1, position: 'relative' }}>
                <VideoPlayer { ...videoJsOptions }  onReady={handlePlayerReady} />
            </div>
            <div className="movie-close-btn" style={{ zIndex: 9999999999, position: 'absolute', top: 15, right: 15, fill: '#fff' }} >
                {videoSrc}
                <img src="icons/cancel-circle.svg" style={{fill: '#fff'}} />
            </div>
        </div>
        

    );


}

export default Player;
