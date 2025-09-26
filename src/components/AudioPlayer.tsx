import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DisplayTrackProps, Track } from '@/utils/interfaceDisplay';
import { Controls } from './Controls';
import { ProgressBar } from './ProgressBar';
import { TrackList } from './TrackList';

export const AudioPlayer: React.FC<DisplayTrackProps> = ({ 
  currentTrack,
  audioRef,
  setDuration: setDurationProp,
  progressBarRef,
  currentAlbum,
  onTrackSelect
}) => {
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  


  // Handle track selection from the track list
  const handleTrackClick = (track: Track, trackIndex: number) => {
    if (onTrackSelect) {
      onTrackSelect(track, trackIndex);
      // Update current track index and set playing state to true
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
    }
  };

  // Handle next track
  const handleNext = () => {
    if (!currentAlbum || !onTrackSelect) return;
    
    const nextIndex = currentTrackIndex >= currentAlbum.tracks.length - 1 ? 0 : currentTrackIndex + 1;
    const nextTrack = currentAlbum.tracks[nextIndex];
    
    
    setCurrentTrackIndex(nextIndex);
    onTrackSelect(nextTrack, nextIndex);
    // Ensure playing state is set to true for skip navigation
    setIsPlaying(true);
  };

  // Handle previous track
  const handlePrevious = () => {
    if (!currentAlbum || !onTrackSelect) return;
    
    const prevIndex = currentTrackIndex <= 0 ? currentAlbum.tracks.length - 1 : currentTrackIndex - 1;
    const prevTrack = currentAlbum.tracks[prevIndex];
    
    setCurrentTrackIndex(prevIndex);
    onTrackSelect(prevTrack, prevIndex);
    // Ensure playing state is set to true for skip navigation
    setIsPlaying(true);
  };

  // Handle setting current track (for Controls component)
  const handleSetCurrentTrack = (track: Track) => {
    if (!currentAlbum || !onTrackSelect) return;
    
    const trackIndex = currentAlbum.tracks.findIndex(t => t.title === track.title);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      onTrackSelect(track, trackIndex);
    }
  };

  // Handle audio metadata loading
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      const seconds = audioRef.current.duration;
      setDuration(seconds);
      setDurationProp(seconds); // Call the prop function as well
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  // Update progress
  const updateProgress = () => {
    if (audioRef.current && progressBarRef.current) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      
      const progress = (currentTime / duration) * 100;
      progressBarRef.current.style.setProperty('--range-progress', `${progress}%`);
    }
  };

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current]); // Watch for changes to audioRef.current instead of audioRef

  // Reset track index when album changes
  useEffect(() => {
    if (currentAlbum) {
      setCurrentTrackIndex(0);
    }
  }, [currentAlbum]);

  // Empty state when no album is selected
  if (!currentAlbum) {
    return (
      <section className="audioPlayer">
        <div className="inner">
          <div className="audioPlayer__empty">
            <div className="audioPlayer__emptyIcon">♪</div>
            <h2>Select an album to start listening</h2>
            <p>Choose an album from the list below to see tracks and start playing music.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="audioPlayer">
      <div className="inner">
        {/* Audio element */}
        <audio 
          ref={(element) => {
            if (audioRef) {
              audioRef.current = element || undefined;
            }
          }}
          src={currentTrack.src}
        />

        {/* Album Info Section */}
        <div className="audioPlayer__content">
          {/* Left side - Album artwork and current track info */}
          <div className="audioPlayer__left">
            <div className="audioPlayer__artwork">
              {currentAlbum.thumbnail ? (
                <Image
                  src={currentAlbum.thumbnail}
                  alt={`${currentAlbum.album} artwork`}
                  width={300}
                  height={300}
                  className="audioPlayer__albumImage"
                />
              ) : (
                <div className="audioPlayer__placeholderArt">♪</div>
              )}
            </div>
            
            <div className="audioPlayer__info">
              <h2 className="audioPlayer__albumTitle">{currentAlbum.album}</h2>
              <h3 className="audioPlayer__artist">{currentAlbum.author}</h3>
              {currentTrack.title && (
                <p className="audioPlayer__currentTrack">
                  Now playing: <span>{currentTrack.title}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right side - Track list */}
          <div className="audioPlayer__right">
            <TrackList
              tracks={currentAlbum.tracks}
              currentTrack={currentTrack}
              onTrackSelect={handleTrackClick}
              albumTitle={currentAlbum.album}
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="audioPlayer__controlsSection">
          <Controls
            audioRef={audioRef}
            progressBarRef={progressBarRef}
            duration={duration}
            setTimeProgress={setTimeProgress}
            albums={[]}
            albumIndex={0}
            tracks={currentAlbum.tracks}
            setAlbumIndex={() => {}}
            setCurrentTrack={handleSetCurrentTrack}
            trackIndex={currentTrackIndex}
            setTrackIndex={setCurrentTrackIndex}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          
          <ProgressBar
            progressBarRef={progressBarRef}
            audioRef={audioRef}
            timeProgress={timeProgress}
            duration={duration}
          />
        </div>
      </div>
    </section>
  );
};