
"use client";
import React from 'react';

import styles from './page.module.scss';
import defaultThumbnail from '../data/default-music-image.png';

import { DisplayTrackProps, Track } from '@/utils/interfaceDisplay';
import { AudioPlayer } from '../components/AudioPlayer';
import { AlbumsList } from '@/components/AlbumsList';
import { albums } from '@/data/tracks';


export default function Home() {
  const [currentTrack, setCurrentTrack] = React.useState<Track | null>(initialTrack);

  // Ref del reproductor de audio
  const audioRef = React.useRef<HTMLAudioElement>(new Audio());

    // Función para reproducir una canción
    const playTrack = (track: Track) => {
      // Establece la nueva canción
      setCurrentTrack(track);
      // Carga la canción en el reproductor de audio
      audioRef.current.src = track.src;
      // Reproduce la canción automáticamente
      audioRef.current.play();
    };

  // Props para AudioPlayer
  const audioPlayerProps: DisplayTrackProps = {
    currentTrack,
    audioRef,
    setDuration: () => {}, // Puedes establecer estos valores como null
    progressBarRef: React.useRef(),
    albums: {}
  };
  return (
    <div className={styles.container}>

      <main className={styles.main}>
          <AudioPlayer {...audioPlayerProps} />
          <AlbumsList albums={albums} />
      </main>

    </div>
  )
}

