import { useState, useEffect } from 'react';
import { AlbumListProps } from '../utils/interfaceAlbumList';
import { Track } from '../utils/interfaceDisplay';
import { apiService } from '../services/api';
import { transformBackendAlbums, getTrackStreamingUrl } from '../utils/dataTransformers';

interface UseMusicDataReturn {
  albums: AlbumListProps[];
  loading: boolean;
  error: string | null;
  playTrack: (track: Track, audioRef: React.RefObject<HTMLAudioElement>, onPlayStart?: () => void) => Promise<void>;
  refreshAlbums: () => Promise<void>;
  isLoadingTrack: boolean;
}

export const useMusicData = (): UseMusicDataReturn => {
  const [albums, setAlbums] = useState<AlbumListProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState<boolean>(false);
  const [currentlyLoadingTrack, setCurrentlyLoadingTrack] = useState<string>('');

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendData = await apiService.fetchAlbums();
      const transformedAlbums = await transformBackendAlbums(backendData);
      
      setAlbums(transformedAlbums);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch albums');
      console.error('Error fetching albums:', err);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = async (track: Track, audioRef: React.RefObject<HTMLAudioElement>, onPlayStart?: () => void) => {
    const trackId = `${track.artist}|${track.album}|${track.title}`;
    
    console.log('🎯 useMusicData.playTrack called for:', track.title);
    console.log('Current loading state:', { isLoadingTrack, currentlyLoadingTrack });
    
    // Allow loading if it's a different track, only prevent if loading the same track
    if (isLoadingTrack && currentlyLoadingTrack === trackId) {
      console.log('Already loading this exact track, ignoring request for:', track.title);
      return;
    }

    try {
      if (!audioRef.current) {
        throw new Error('Audio reference not available');
      }

      setIsLoadingTrack(true);
      setCurrentlyLoadingTrack(trackId);
      setError(null);

      // Always use the full reload approach for consistency
      console.log('🎯 Using full reload approach for all tracks to ensure consistency');
      
      console.log('🛑 Different track or not ready, stopping current playback and resetting audio');
      // Stop current playback and reset only if it's a different track
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // If track already has a src URL (cached), use it
      if (track.src && track.src.startsWith('http')) {
        console.log('📦 Using cached URL for track:', track.title);
        audioRef.current.src = track.src;
        audioRef.current.load();
        
        // Wait for audio to be ready
        await new Promise((resolve) => {
          const checkReady = () => {
            if (audioRef.current && audioRef.current.readyState >= 3) {
              console.log('✅ Cached track ready to play');
              resolve(undefined);
            } else {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        });
        
        await audioRef.current.play();
        console.log('Audio play() called successfully');
        
        // Manually trigger play callback since audio events might not fire
        if (onPlayStart) {
          console.log('🔄 Triggering play callback to update UI state');
          onPlayStart();
        }
        return;
      }

      // If it's a backend track, get streaming URL
      if (track.key) {
        const streamingUrl = await getTrackStreamingUrl(track);
        track.src = streamingUrl; // Cache the URL
        
        if (audioRef.current.src !== streamingUrl) {
          audioRef.current.src = streamingUrl;
          audioRef.current.load();
          // Small delay to let the source load
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        await audioRef.current.play();
        console.log('Audio play() called successfully');
        
        // Manually trigger play callback since audio events might not fire
        if (onPlayStart) {
          console.log('🔄 Triggering play callback to update UI state');
          onPlayStart();
        }
      } else {
        // Local track (fallback for existing local files)
        if (audioRef.current.src !== track.src) {
          audioRef.current.src = track.src;
          audioRef.current.load();
        }
        await audioRef.current.play();
        console.log('Audio play() called successfully');
        
        // Manually trigger play callback since audio events might not fire
        if (onPlayStart) {
          console.log('🔄 Triggering play callback to update UI state');
          onPlayStart();
        }
      }
    } catch (err) {
      // Ignore AbortError as it's expected when switching tracks quickly
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Track loading was aborted (likely due to track change)');
        return;
      }
      console.error('Error playing track:', err);
      setError(err instanceof Error ? err.message : 'Failed to play track');
    } finally {
      setIsLoadingTrack(false);
      setCurrentlyLoadingTrack('');
    }
  };

  const refreshAlbums = async () => {
    await fetchAlbums();
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return {
    albums,
    loading,
    error,
    playTrack,
    refreshAlbums,
    isLoadingTrack
  };
};
