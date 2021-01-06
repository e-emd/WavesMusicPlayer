import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
  faInfinity,
  faVolumeDown,
  faVolumeUp,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

const Player = ({
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  currentSong,
  songs,
  setCurrentSong,
  setSongs,
  volume,
  setVolume,
  setSongVolume,
}) => {
  const [activeVolume, setActiveVolume] = useState(false);

  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });

    setSongs(newSongs);
  };

  //Event Handlers
  function getTime(time) {
    return (
      Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
    );
  }
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    //Forward BAck
    if (direction === 'skip-forward') {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === 'skip-back') {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
    if (isPlaying) audioRef.current.play();
  };

  const trackAnimation = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  const changeVolumeHandler = (e) => {
    const value = e.target.value / 100;
    localStorage.setItem('volume', value);
    setVolume(value);
    audioRef.current.volume = volume;
    if (value === 0) audioRef.current.volume = 0;
  };

  const volumeIcon = () => {
    if (volume >= 0.5) {
      return faVolumeUp;
    } else if (volume === 0) {
      return faVolumeMute;
    } else if (volume <= 0.5) {
      return faVolumeDown;
    }
  };

  const muteVolume = () => {
    if (volume === 0) {
      setVolume(JSON.parse(localStorage.getItem('volume')));
      audioRef.current.volume = JSON.parse(localStorage.getItem('volume'));
      return;
    }
    setVolume(0);
    audioRef.current.volume = 0;
  };

  return (
    <div className='player-container'>
      <div className='time-control'>
        <div
          className='cont'
          onMouseOver={() => {
            setActiveVolume(true);
          }}
          onMouseLeave={() => setActiveVolume(false)}
        >
          <FontAwesomeIcon
            onClick={muteVolume}
            size='2x'
            icon={volumeIcon()}
            className='audioSVG'
          />
          <div
            className='track2'
            style={{
              opacity: `${activeVolume ? '1' : '0'}`,
              pointerEvents: `${activeVolume ? 'all' : 'none'}`,
            }}
          >
            <input
              type='range'
              max='100'
              min='0'
              onChange={changeVolumeHandler}
            />
            <div
              className='passedVolume'
              style={{ transform: `translateX(${volume * 100})` }}
            ></div>
          </div>
        </div>
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(90deg, #0cebeb 0%, ${currentSong.color[0]} 50%, ${currentSong.color[1]} 100% )`,
          }}
          className='track'
        >
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type='range'
          />
          <div style={trackAnimation} className='animate-track'></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : '00:00'}</p>
      </div>
      <div className='play-control'>
        <FontAwesomeIcon
          onClick={() => skipTrackHandler('skip-back')}
          className='skip-back'
          size='2x'
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className='play'
          size='2x'
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler('skip-forward')}
          className='skip-forward'
          size='2x'
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
