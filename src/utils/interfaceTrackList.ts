import { Track } from './interfaceDisplay';

export interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track, trackIndex: number) => void;
  albumTitle?: string;
}
