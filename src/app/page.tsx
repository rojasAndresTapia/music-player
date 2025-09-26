
"use client";
import React from 'react';

// Import centralized styles
import '../styles/styles.scss';

import { DisplayTrackProps, Track } from '@/utils/interfaceDisplay';
import { AudioPlayer } from '../components/AudioPlayer';
import { AlbumsList } from '@/components/AlbumsList';
import { albums } from '@/data/tracks';
import { AlbumListProps } from '@/utils/interfaceAlbumList';

export default function Home() {
  const [currentTrack, setCurrentTrack] = React.useState<Track | null>(null);
  const [currentAlbum, setCurrentAlbum] = React.useState<AlbumListProps | null>(null);

  // Ref del reproductor de audio
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element on client side
  React.useEffect(() => {
    audioRef.current = new Audio();
  }, []);

    // Función para reproducir una canción
    const playTrack = (track: Track) => {
      // Establece la nueva canción
      setCurrentTrack(track);
      // Carga la canción en el reproductor de audio
      if (audioRef.current) {
        audioRef.current.src = track.src;
        // Reproduce la canción automáticamente
        audioRef.current.play();
      }
    };

    // Handle album selection
    const handleAlbumSelect = (album: AlbumListProps) => {
      console.log('Album selected:', album.album);
      setCurrentAlbum(album);
      // Pre-select the first track without playing it
      if (album.tracks.length > 0) {
        console.log('Pre-selecting first track:', album.tracks[0].title);
        setCurrentTrack(album.tracks[0]);
        if (audioRef.current) {
          console.log('Setting audio source to:', album.tracks[0].src);
          audioRef.current.src = album.tracks[0].src;
          // Don't call play() - just set the source
        }
      } else {
        setCurrentTrack(null);
      }
    };

    // Handle track selection from AlbumData component
    const handleTrackSelect = (track: Track, trackIndex: number) => {
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.src;
        // Small delay to ensure the source is set before playing
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(error => {
              console.error('Error playing audio:', error);
            });
          }
        }, 50);
      }
    };

  // Props para AudioPlayer
  const audioPlayerProps: DisplayTrackProps = {
    currentTrack: currentTrack || { title: '', album: '', src: '' },
    audioRef: audioRef as React.MutableRefObject<HTMLAudioElement | undefined>,
    setDuration: () => {}, // Puedes establecer estos valores como null
    progressBarRef: React.useRef(),
    albums: {},
    currentAlbum: currentAlbum,
    onTrackSelect: handleTrackSelect
  };
  return (
    <div className="container">
      <main className="main-content">
        <AudioPlayer {...audioPlayerProps} />
        <AlbumsList 
          albums={albums} 
          onAlbumSelect={handleAlbumSelect}
        />
      </main>
    </div>
  )
}

