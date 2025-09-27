
"use client";
import React from 'react';

// Import centralized styles
import '../styles/styles.scss';

import { DisplayTrackProps, Track } from '@/utils/interfaceDisplay';
import { AudioPlayer } from '../components/AudioPlayer';
import { SmartAlbumsList } from '@/components/SmartAlbumsList';
import { ArtistAlbumsSimple } from '@/components/ArtistAlbumsSimple';
import { useMusicData } from '@/hooks/useMusicData';
import { AlbumListProps } from '@/utils/interfaceAlbumList';
import { Artist } from '@/utils/interfaceArtist';
import { getTrackStreamingUrl } from '@/utils/dataTransformers';

export default function Home() {
  const { albums, loading, error, playTrack: apiPlayTrack, isLoadingTrack } = useMusicData();
  const [currentTrack, setCurrentTrack] = React.useState<Track | null>(null);
  const [currentAlbum, setCurrentAlbum] = React.useState<AlbumListProps | null>(null);
  const [lastTrackChangeTime, setLastTrackChangeTime] = React.useState<number>(0);
  const [lastTrackChangeSource, setLastTrackChangeSource] = React.useState<string>('');
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  
  // Simple navigation: either showing mixed list or specific artist's albums
  const [selectedArtist, setSelectedArtist] = React.useState<Artist | null>(null);

  // Ref del reproductor de audio
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element on client side
  React.useEffect(() => {
    audioRef.current = new Audio();
    
    // Add event listeners for pause events
    if (audioRef.current) {
      const handlePause = () => {
        console.log('🛑 Main page detected audio pause');
        setIsPlaying(false);
      };
      
      const handlePlay = () => {
        console.log('🎵 Main page detected audio play');
        setIsPlaying(true);
      };
      
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('play', handlePlay);
          audioRef.current.removeEventListener('pause', handlePause);
        }
      };
    }
  }, []);

    // Función para reproducir una canción
    const playTrack = async (track: Track) => {
      try {
        // Establece la nueva canción
        setCurrentTrack(track);
        // Usa la función del hook que maneja las URLs de streaming
        await apiPlayTrack(track, audioRef, () => {
          console.log('🎵 Play callback triggered - updating main page isPlaying state');
          setIsPlaying(true);
        });
      } catch (error) {
        console.error('Error playing track:', error);
      }
    };

    // Simple navigation handlers
    const handleArtistSelect = (artist: Artist) => {
      console.log('Artist selected:', artist.name, `(${artist.albums.length} albums)`);
      setSelectedArtist(artist);
    };

    const handleBackToList = () => {
      console.log('Back to mixed album/artist list');
      setSelectedArtist(null);
      // Clear current album and track when going back
      setCurrentAlbum(null);
      setCurrentTrack(null);
      setIsPlaying(false);
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    // Handle album selection
    const handleAlbumSelect = async (album: AlbumListProps) => {
      console.log('Album selected:', album.album);
      setCurrentAlbum(album);
      // Pre-select the first track and load its streaming URL
      if (album.tracks.length > 0) {
        const firstTrack = album.tracks[0];
        console.log('Pre-selecting first track:', firstTrack.title);
        setCurrentTrack(firstTrack);
        
        try {
          // Pre-load the streaming URL for the first track (simple approach like background caching)
          if (firstTrack.key) {
            console.log('🔄 Starting to pre-load first track:', firstTrack.title);
            try {
              const streamingUrl = await getTrackStreamingUrl(firstTrack);
              firstTrack.src = streamingUrl; // Cache the URL
              console.log('✅ First track URL cached:', firstTrack.title);
              
              // Set the audio source but don't try to load it yet
              if (audioRef.current) {
                audioRef.current.src = streamingUrl;
                console.log('🎯 First track source set in audio element');
              }
            } catch (error) {
              console.error('❌ Error pre-loading first track:', error);
            }
          }
          
          // Pre-cache ALL tracks in the album for instant playback
          if (album.tracks.length > 1) {
            setTimeout(async () => {
              console.log('🚀 Starting to pre-cache ALL tracks in album...');
              for (let i = 1; i < album.tracks.length; i++) {
                const track = album.tracks[i];
                if (track.key && !track.src) {
                  try {
                    const streamingUrl = await getTrackStreamingUrl(track);
                    track.src = streamingUrl; // Cache the URL
                    console.log(`✅ Pre-cached track ${i + 1}/${album.tracks.length}:`, track.title);
                  } catch (error) {
                    console.error('❌ Error pre-caching track:', track.title, error);
                  }
                  
                  // Small delay between requests to avoid overwhelming the backend
                  await new Promise(resolve => setTimeout(resolve, 200));
                }
              }
              console.log('🎉 Finished pre-caching all tracks in album!');
            }, 1000); // Start pre-caching after 1 second
          }
        } catch (error) {
          console.error('Error pre-loading track:', error);
        }
      } else {
        setCurrentTrack(null);
      }
    };

    // Handle track selection from AlbumData component
    const handleTrackSelect = async (track: Track, trackIndex: number, source: string = 'manual') => {
      const now = Date.now();
      
      // Smart debouncing: Only debounce rapid manual clicks on the same track
      if (source === 'manual' && 
          now - lastTrackChangeTime < 200 && 
          lastTrackChangeSource === 'manual' &&
          currentTrack?.title === track.title) {
        console.log('Same track clicked too rapidly, ignoring');
        return;
      }
      
      console.log('Track selected:', track.title, 'from:', source);
      setCurrentTrack(track);
      setLastTrackChangeTime(now);
      setLastTrackChangeSource(source);
      
      try {
        // Use the API play track function to load streaming URL and play
        await apiPlayTrack(track, audioRef, () => {
          console.log('🎵 Track selection play callback triggered for:', track.title);
          setIsPlaying(true);
        });
      } catch (error) {
        console.error('Error playing selected track:', error);
      }
    };

  // Initial track state
  const initialTrack: Track = {
    album: '',
    title: 'Select a song to play',
    src: '',
    artist: ''
  };

  // Props para AudioPlayer
  const audioPlayerProps: DisplayTrackProps = {
    currentTrack: currentTrack || initialTrack,
    audioRef: audioRef as React.MutableRefObject<HTMLAudioElement | undefined>,
    setDuration: () => {}, // Puedes establecer estos valores como null
    progressBarRef: React.useRef(),
    albums: {},
    currentAlbum: currentAlbum,
    onTrackSelect: handleTrackSelect,
    playTrack: playTrack,
    isLoadingTrack: isLoadingTrack,
    isPlaying: isPlaying,
    setIsPlaying: setIsPlaying
  };
  // Loading state
  if (loading) {
    return (
      <div className="container">
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading your music library from S3...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container">
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>Error loading music: {error}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="main-content">
        <AudioPlayer {...audioPlayerProps} />
        
        {/* Simple two-level navigation */}
        {selectedArtist ? (
          // Show albums for selected artist
          <ArtistAlbumsSimple
            artist={selectedArtist}
            onAlbumSelect={handleAlbumSelect}
            onBackToList={handleBackToList}
          />
        ) : (
          // Show smart mixed list (artist cards + individual albums)
          <SmartAlbumsList
            albums={albums}
            onAlbumSelect={handleAlbumSelect}
            onArtistSelect={handleArtistSelect}
          />
        )}
      </main>
    </div>
  )
}

