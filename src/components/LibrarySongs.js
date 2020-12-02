import React from 'react';

const LibrarySongs = ({
  songs,
  song,
  setCurrentSong,
  id,
  audioRef,
  isPlaying,
  setSongs,
}) => {
  const updateSongs = () => {
    setSongs(
      songs.map((targetSong) => {
        return { ...targetSong, active: targetSong.id === id };
      })
    );
  };

  const songSelectHandler = () => {
    setCurrentSong(song);
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then((audio) => {
          audioRef.current.play();
        });
      }
    }
  };
  return (
    <div
      onClick={() => {
        songSelectHandler();
        updateSongs();
      }}
      className={`library-song ${song.active ? 'selected' : ''}`}
    >
      <img src={song.cover} alt={song.name} />
      <div className='song-description'>
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySongs;
