import { ProgressBarProps } from '@/utils/interfaceProgressBar';

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressBarRef, audioRef, timeProgress, duration }) => {

  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
  };

  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes =
        minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds =
        seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };



    return (
      <section className="progressSection">
        <div className="progressContainer">
          <span className="timeDisplay current">{formatTime(timeProgress)}</span>
          <input 
            type="range" 
            ref={progressBarRef} 
            className="inputRange"
            defaultValue="0"
            onChange={handleProgressChange}
          />
          <span className="timeDisplay">{formatTime(duration)}</span>
        </div>
      </section>
    );
  };