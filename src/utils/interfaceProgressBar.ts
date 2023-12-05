export interface ProgressBarProps {
    progressBarRef: React.MutableRefObject<any>; // definir el tipo correcto aquí
    audioRef: React.MutableRefObject<any>;
    timeProgress: number;
    duration: number;
  }