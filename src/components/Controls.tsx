import React, { useCallback, useEffect } from 'react';

import styles from '../styles/AudioPlayer.module.scss'

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
  handleNext
 }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playAnimationRef = React.useRef<number | null>(null);
  const [volume, setVolume] = React.useState(60)
  const [muteVolume, setMuteVolume] = React.useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  //play and pause progress bar animation
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        requestAnimationFrame(repeat);
      } else {
        audioRef.current.pause();
        cancelAnimationFrame(playAnimationRef.current!);
      }
    }
  }, [isPlaying, audioRef]);

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

  const handlePrevious = () => {
    if (trackIndex === 0) {
      let lastTrackIndex = tracks.length - 1;
      setTrackIndex(lastTrackIndex);
      setCurrentTrack(tracks[lastTrackIndex]);
    } else {
      setTrackIndex((prev: number) => prev - 1);
      setCurrentTrack(tracks[trackIndex - 1]);
    }
  };

  return (
    <section>
      <div className={styles.controlsWrapper}>
        <div className={styles.controls}>
          <button onClick={handlePrevious}>
            <SkipPreviousIcon/>
          </button>
          <button onClick={skipBackward}>
            <FastRewindIcon/>
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
          <button onClick={skipForward}>
            <FastForwardIcon />
          </button>
          <button onClick={handleNext}>
            <SkipNextIcon />
          </button>
          <div className={styles.volume}>
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
            style={{
              background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
            }}
              type="range" 
              min={0} 
              max={100}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))} 
              />
          </div>
        </div>
      </div>
    </section>
  );
};