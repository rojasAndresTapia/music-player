import React from 'react';
import { DisplayTrackProps } from '@/utils/interfaceDisplay';
import { AlbumListProps } from '@/utils/interfaceAlbumList';
import Image from 'next/image';

import MusicNoteIcon from '@mui/icons-material/MusicNote';

export const DisplayTrack: React.FC<DisplayTrackProps> = ({ 
  currentTrack, 
  audioRef, 
  setDuration, 
  progressBarRef, 
  handleNext, 
  albums 
}) => {
    const onLoadedMetadata = () => {
        if (audioRef.current) {
            const seconds = audioRef.current.duration;
            setDuration(seconds);
            progressBarRef.current.max = seconds;
        }
    };

    // Convierte el objeto 'albums' en un array
    const albumsArray = Object.values(albums);

    // Utiliza filter() para encontrar el álbum correspondiente
    const currentAlbum = albumsArray.filter(
      (album: AlbumListProps) => album.album === currentTrack.album
    )[0];
   



  return (
    <div>
      <audio 
        src={currentTrack.src} 
        ref={(element) => {
          if (element) {
            audioRef.current = element;
          }
        }}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="audioInfo">
        <div className="audioImageContainer">
          <div className="audioImage">
            {currentAlbum && currentAlbum.thumbnail ? (
              <Image 
                src={currentAlbum.thumbnail} 
                alt="audio avatar" 
                width={300}
                height={300}
              />
            ) : (
              <div className="iconWrapper">
                <span className="audioIcon">
                  <MusicNoteIcon />
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="textInfo">
          <p className="title">{currentTrack.title}</p>
          <p className="artist">{currentTrack.album}</p>
        </div>
      </div>
    </div>
  );
};