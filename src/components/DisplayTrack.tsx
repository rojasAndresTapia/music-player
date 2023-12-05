import React from 'react';
import { DisplayTrackProps } from '@/utils/interfaceDisplay';
import { AlbumListProps } from '@/utils/interfaceAlbumList';
import Image from 'next/image';
import  styles  from '../styles/AudioPlayer.module.scss'

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
      onEnded={handleNext}/>
      <div className={styles.audioInfo}>
        <div className={styles.audioImage}>
          {currentAlbum && currentAlbum.thumbnail ? (
            <Image src={currentAlbum.thumbnail} alt="audio avatar" />
          ) : (
            <div className={styles.iconWrapper}>
              <span className={styles.audioIcon}>
                <MusicNoteIcon />
              </span>
            </div>
          )}
        </div>
        <div className={styles.text}>
          <p className={styles.title}>{currentTrack.title}</p>
          <p>{currentTrack.album}</p>
        </div>
      </div>
    </div>
  );
};