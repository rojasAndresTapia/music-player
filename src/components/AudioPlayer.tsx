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
  onTrackSelect,
  playTrack,
  isPlaying: isPlayingProp,
  setIsPlaying: setIsPlayingProp
}) => {
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Use passed isPlaying state or fallback to local state
  const isPlaying = isPlayingProp !== undefined ? isPlayingProp : false;
  const setIsPlaying = setIsPlayingProp || (() => {});
  


  // Handle track selection from the track list
  const handleTrackClick = (track: Track, trackIndex: number) => {
    if (onTrackSelect) {
      onTrackSelect(track, trackIndex, 'tracklist');
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
    
    console.log('Skip Next - moving to track:', nextTrack.title);
    setCurrentTrackIndex(nextIndex);
    onTrackSelect(nextTrack, nextIndex, 'skip-next');
    // Note: Don't set isPlaying here - let the track loading handle it
  };

  // Handle previous track
  const handlePrevious = () => {
    if (!currentAlbum || !onTrackSelect) return;
    
    const prevIndex = currentTrackIndex <= 0 ? currentAlbum.tracks.length - 1 : currentTrackIndex - 1;
    const prevTrack = currentAlbum.tracks[prevIndex];
    
    console.log('Skip Previous - moving to track:', prevTrack.title);
    setCurrentTrackIndex(prevIndex);
    onTrackSelect(prevTrack, prevIndex, 'skip-previous');
    // Note: Don't set isPlaying here - let the track loading handle it
  };

  // Handle setting current track (for Controls component)
  const handleSetCurrentTrack = (track: Track) => {
    if (!currentAlbum || !onTrackSelect) return;
    
    const trackIndex = currentAlbum.tracks.findIndex(t => t.title === track.title);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      onTrackSelect(track, trackIndex, 'controls');
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

  // Single, clean event listener setup
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      console.log('🎯 Setting up CLEAN audio event listeners');
      
      const handlePlay = () => {
        console.log('🎵 CLEAN - Audio play event triggered');
        setIsPlaying(true);
      };
      
      const handlePause = () => {
        console.log('⏸️ CLEAN - Audio pause event triggered');
        setIsPlaying(false);
      };
      
      const handleTimeUpdate = () => {
        if (progressBarRef.current && audio) {
          const currentTime = audio.currentTime;
          const duration = audio.duration;
          setTimeProgress(currentTime);
          
          if (progressBarRef.current) {
            const progress = (currentTime / duration) * 100;
            progressBarRef.current.style.setProperty('--range-progress', `${progress}%`);
          }
        }
      };
      
      const handleLoadedMetadata = () => {
        if (audio) {
          const seconds = audio.duration;
          setDuration(seconds);
          if (setDurationProp) setDurationProp(seconds);
        }
      };
      
      // Add all event listeners
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      console.log('✅ Clean event listeners attached');
      
      return () => {
        console.log('🧹 Removing clean event listeners');
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []); // Run once on mount
  
  // Simplified state check - only log, don't auto-correct
  useEffect(() => {
    const checkPlayingState = () => {
      if (audioRef.current && !audioRef.current.paused && !audioRef.current.ended) {
        if (!isPlaying) {
          console.log('🔍 Detected: Audio is playing but UI state is false');
          console.log('Audio details:', {
            paused: audioRef.current.paused,
            ended: audioRef.current.ended,
            currentTime: audioRef.current.currentTime,
            duration: audioRef.current.duration
          });
          // Don't auto-correct - let's see what's happening first
        }
      }
    };
    
    const interval = setInterval(checkPlayingState, 1000); // Check every 1 second
    return () => clearInterval(interval);
  }, [isPlaying]);

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
            playTrack={playTrack}
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