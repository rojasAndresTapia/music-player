import React, { useEffect, useState } from 'react';
import styles from '../styles/AudioPlayer.module.scss';

import { DisplayTrack } from './DisplayTrack';
import { Controls } from './Controls';
import { ProgressBar } from './ProgressBar';
import { albums } from '../data/tracks';
import { DisplayTrackProps, Track } from '@/utils/interfaceDisplay';
import { AlbumListProps } from '@/utils/interfaceAlbumList';

export const AudioPlayer: React.FC<DisplayTrackProps> = () => {
  const [albumIndex, setAlbumIndex] = useState(0);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState<number | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentAlbum = Object.values(albums)[albumIndex];
  const albumsObject: Record<string, AlbumListProps> = {};
  const currentTrack = currentAlbum.tracks[trackIndex];
  const tracksInCurrentAlbum: Track[] = currentAlbum.tracks;

  // reference
  const audioRef = React.useRef<HTMLAudioElement | undefined>(
    typeof Audio !== 'undefined' ? new Audio(currentTrack.src) : undefined
  );

  const progressBarRef = React.useRef<HTMLInputElement | null>(null);

  const handleNext = () => {
    if (trackIndex >= currentAlbum.tracks.length - 1) {
      if (albumIndex >= Object.keys(albums).length - 1) {
        // Vuelve al primer álbum si estás en el último álbum
        setAlbumIndex(0);
      } else {
        setAlbumIndex((prev) => prev + 1);
      }
      setTrackIndex(0);
    } else {
      setTrackIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentTrack.src) {
      // Actualiza la fuente de audio con la nueva pista
      audioRef.current.src = currentTrack.src;

      // Inicia automáticamente la reproducción
      audioRef.current.play();
    }
  }, [currentTrack, audioRef]);

  useEffect(() => {
    if (currentAlbumIndex !== null) {
      // Verifica si se ha seleccionado un álbum
      setAlbumIndex(currentAlbumIndex);
      setTrackIndex(0); // Establece la primera canción del álbum como currentTrack
      setCurrentAlbumIndex(null); // Reinicia la selección de álbum
    }
  }, [currentAlbumIndex]);

  return (
    <section className={styles.audioPlayer}>
      <div className={styles.inner}>
        <DisplayTrack
          currentTrack={currentTrack}
          audioRef={audioRef}
          setDuration={setDuration}
          progressBarRef={progressBarRef}
          albums={albumsObject}
          handleNext={handleNext}
        />
        <Controls
          audioRef={audioRef}
          progressBarRef={progressBarRef}
          duration={duration}
          setTimeProgress={setTimeProgress}
          albums={Object.values(albums)}
          albumIndex={albumIndex}
          tracks={tracksInCurrentAlbum} 
          setAlbumIndex={setAlbumIndex}
          setCurrentTrack={(track) => {
            console.log("track", track);
          }}
          trackIndex={trackIndex}
          setTrackIndex={setTrackIndex}
          handleNext={handleNext}
        />
        <ProgressBar
          progressBarRef={progressBarRef}
          audioRef={audioRef}
          timeProgress={timeProgress}
          duration={duration}
        />
      </div>

    </section>
  );
};