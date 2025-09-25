import React from 'react';
import { TrackListProps } from '@/utils/interfaceTrackList';

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  onTrackSelect,
  albumTitle
}) => {
  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle track selection
  const handleTrackClick = (track: any, trackIndex: number) => {
    onTrackSelect(track, trackIndex);
  };

  return (
    <div className="trackList">
      <div className="trackList__container">
        <h4 className="trackList__title">
          {albumTitle ? `${albumTitle} - Tracks (${tracks.length})` : `Tracks (${tracks.length})`}
        </h4>
        <div className="trackList__tracks">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`trackList__track ${
                currentTrack && currentTrack.title === track.title 
                  ? 'trackList__track--active' 
                  : ''
              }`}
              onClick={() => handleTrackClick(track, index)}
            >
              <div className="trackList__trackNumber">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <div className="trackList__trackInfo">
                <div className="trackList__trackTitle">{track.title}</div>
                <div className="trackList__trackDuration">
                  {formatDuration(240)} {/* Placeholder duration */}
                </div>
              </div>
              <div className="trackList__playIcon">
                {currentTrack && currentTrack.title === track.title ? '⏸' : '▶'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
