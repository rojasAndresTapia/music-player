// interfaceControls.ts

import { Track } from '@/utils/interfaceDisplay'; // Asegúrate de importar la interfaz Track correcta
import { StaticImageData } from 'next/image';

export interface ControlsProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | undefined>;
  progressBarRef: React.MutableRefObject<any>;
  duration: number;
  setTimeProgress: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  trackIndex: number;
  setTrackIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track>>;
  handleNext: () => void;
  albums: {
    author: string;
    thumbnail?: StaticImageData | string;
    tracks: {
      title: string;
      src: any;
    }[];
  }[];
  albumIndex: number; // Asegúrate de que 'albumIndex' esté definido correctamente
  setAlbumIndex: React.Dispatch<React.SetStateAction<number>>;
}