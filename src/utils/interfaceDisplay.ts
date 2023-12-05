import { AlbumListProps } from './interfaceAlbumList';

export interface Track {
  album: string,
  title: string;
  src: any;
}

export interface DisplayTrackProps {
  currentTrack: Track;
  audioRef: React.MutableRefObject<HTMLAudioElement | undefined>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  progressBarRef: React.MutableRefObject<any>;
  handleNext?: () => void;
  albums: Record<string, AlbumListProps>; // Ahora utiliza la interfaz Album directamente
}