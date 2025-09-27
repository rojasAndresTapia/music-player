import React, { useCallback, useEffect } from 'react';

import { ControlsProps } from '../utils/interfaceControls';

import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export const Controls: React.FC<ControlsProps> = ({ 
  audioRef, 
  progressBarRef, 
  duration, 
  setTimeProgress,
  tracks,
  trackIndex,
  setTrackIndex,
  setCurrentTrack,
  playTrack,
  handleNext,
  handlePrevious,
  isPlaying: isPlayingProp,
  setIsPlaying: setIsPlayingProp
 }) => {
  // Use the isPlaying state from parent if provided, otherwise use local state
  const [localIsPlaying, setLocalIsPlaying] = React.useState(false);
  const isPlaying = isPlayingProp !== undefined ? isPlayingProp : localIsPlaying;
  const setIsPlaying = setIsPlayingProp !== undefined ? setIsPlayingProp : setLocalIsPlaying;
  
  const playAnimationRef = React.useRef<number | null>(null);
  const [volume, setVolume] = React.useState(60)
  const [muteVolume, setMuteVolume] = React.useState(false);

  const togglePlayPause = async () => {
    if (audioRef.current) {
      console.log('🎮 togglePlayPause called');
      console.log('Current state:', {
        isPlaying,
        hasSource: !!audioRef.current.src,
        audioSrc: audioRef.current.src,
        tracksLength: tracks.length,
        audioPaused: audioRef.current.paused,
        audioEnded: audioRef.current.ended,
        audioCurrentTime: audioRef.current.currentTime,
        audioReadyState: audioRef.current.readyState
      });
      
      if (isPlaying) {
        console.log('🛑 Pausing audio');
        audioRef.current.pause();
        
        // Manually update state to ensure UI responds immediately
        console.log('🔄 Manually setting isPlaying to false');
        setIsPlaying(false);
      } else {
        // Check if audio has a source, if not, start with first track
        if (!audioRef.current.src || audioRef.current.src === '') {
          console.log('No audio source, loading first track');
          if (tracks.length > 0 && playTrack) {
            // Use the playTrack function to properly load and play the first track
            setCurrentTrack(tracks[0]);
            setTrackIndex(0);
            await playTrack(tracks[0]);
            
            // Manually update isPlaying state since audio events might not fire properly
            console.log('🔄 Manually setting isPlaying to true after playTrack');
            setIsPlaying(true);
          }
        } else {
          console.log('▶️ Resuming or starting audio playback');
          
          // Check if audio is just paused (same track) or needs new track loading
          if (audioRef.current.src && audioRef.current.currentTime > 0) {
            console.log('🔄 Audio is paused, resuming directly');
            try {
              await audioRef.current.play();
              console.log('✅ Audio resumed successfully');
              setIsPlaying(true);
            } catch (error) {
              console.error('❌ Audio resume failed:', error);
            }
          } else {
            console.log('🎯 No current playback, using playTrack function');
            if (tracks.length > 0 && playTrack) {
              const currentTrackIndex = trackIndex || 0;
              const currentTrack = tracks[currentTrackIndex];
              if (currentTrack) {
                console.log('🎵 Using playTrack function for:', currentTrack.title);
                await playTrack(currentTrack);
              }
            } else {
              // Fallback if no playTrack function available
              console.log('🔄 Fallback: direct audio play (no playTrack function)');
              try {
                await audioRef.current.play();
                setIsPlaying(true);
              } catch (error) {
                console.error('❌ Direct audio play failed:', error);
              }
            }
          }
        }
      }
      // The isPlaying state will be updated by the audio event listeners in AudioPlayer
    }
  };

  //play and pause progress bar animation
  useEffect(() => {
    if (isPlaying) {
      requestAnimationFrame(repeat);
    } else {
      cancelAnimationFrame(playAnimationRef.current!);
    }
  }, [isPlaying]);

  //volume controls
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  const repeat = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime;
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(progressBarRef.current.value / duration) * 100}%`
      );
      console.log("run");
      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
    }
  };

  const handlePreviousClick = () => {
    // Use the handlePrevious prop if provided, otherwise use local logic
    if (handlePrevious) {
      handlePrevious();
    } else {
      // Fallback logic (original implementation)
      if (trackIndex === 0) {
        let lastTrackIndex = tracks.length - 1;
        setTrackIndex(lastTrackIndex);
        setCurrentTrack(tracks[lastTrackIndex]);
      } else {
        setTrackIndex((prev: number) => prev - 1);
        setCurrentTrack(tracks[trackIndex - 1]);
      }
    }
  };

  return (
    <section className="controlsWrapper">
      <div className="controls">
        <button onClick={handlePreviousClick}>
          <SkipPreviousIcon />
        </button>
        <button onClick={skipBackward}>
          <FastRewindIcon />
        </button>
        <button onClick={togglePlayPause} className="playPause">
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </button>
        <button onClick={skipForward}>
          <FastForwardIcon />
        </button>
        <button onClick={handleNext}>
          <SkipNextIcon />
        </button>
      </div>
      <div className="volumeControl">
        <button onClick={() => setMuteVolume((prev) => !prev)}>
          {muteVolume || volume < 5 ? (
            <VolumeOffIcon />
          ) : volume < 40 ? (
            <VolumeDownIcon />
          ) : (
            <VolumeUpIcon />
          )}
        </button>
        <input   
          className="volumeRange"
          style={{
            '--range-progress': `${volume}%`,
          } as React.CSSProperties}
          type="range" 
          min={0} 
          max={100}
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))} 
        />
      </div>
    </section>
  );
};