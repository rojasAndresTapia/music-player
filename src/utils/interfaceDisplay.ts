import { AlbumListProps } from './interfaceAlbumList';

export interface Track {
  album: string;
  title: string;
  src: string; // Now will be either local file or URL from backend
  artist: string;
  key?: string; // S3 key for backend tracks
}

export interface DisplayTrackProps {
  currentTrack: Track;
  audioRef: React.MutableRefObject<HTMLAudioElement | undefined>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  progressBarRef: React.MutableRefObject<any>;
  handleNext?: () => void;
  albums: Record<string, AlbumListProps>; // Ahora utiliza la interfaz Album directamente
  currentAlbum?: AlbumListProps | null;
  onTrackSelect?: (track: Track, trackIndex: number, source?: string) => void;
  playTrack?: (track: Track) => Promise<void>;
  isLoadingTrack?: boolean;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
}