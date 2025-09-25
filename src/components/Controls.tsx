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

  const togglePlayPause = () => {
    if (audioRef.current) {
      console.log('togglePlayPause - isPlaying:', isPlaying);
      console.log('togglePlayPause - audioRef.current.src:', audioRef.current.src);
      console.log('togglePlayPause - tracks.length:', tracks.length);
      
      if (isPlaying) {
        console.log('Pausing audio');
        audioRef.current.pause();
      } else {
        // Check if audio has a source, if not, start with first track
        if (!audioRef.current.src || audioRef.current.src === '') {
          console.log('No audio source, setting first track');
          if (tracks.length > 0) {
            // Start playing the first track
            setCurrentTrack(tracks[0]);
            setTrackIndex(0);
          }
        } else {
          console.log('Playing audio with existing source');
          audioRef.current.play();
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