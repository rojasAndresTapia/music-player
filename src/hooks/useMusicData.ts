import { useState, useEffect } from 'react';
import { AlbumListProps } from '../utils/interfaceAlbumList';
import { Track } from '../utils/interfaceDisplay';
import { apiService } from '../services/api';
import { transformBackendAlbums, getTrackStreamingUrl } from '../utils/dataTransformers';

interface UseMusicDataReturn {
  albums: AlbumListProps[];
  loading: boolean;
  error: string | null;
  playTrack: (track: Track, audioRef: React.RefObject<HTMLAudioElement>) => Promise<void>;
  refreshAlbums: () => Promise<void>;
}

export const useMusicData = (): UseMusicDataReturn => {
  const [albums, setAlbums] = useState<AlbumListProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const playTrack = async (track: Track, audioRef: React.RefObject<HTMLAudioElement>) => {
    try {
      if (!audioRef.current) {
        throw new Error('Audio reference not available');
      }

      // If track already has a src URL (cached), use it
      if (track.src && track.src.startsWith('http')) {
        audioRef.current.src = track.src;
        await audioRef.current.play();
        return;
      }

      // If it's a backend track, get streaming URL
      if (track.key) {
        const streamingUrl = await getTrackStreamingUrl(track);
        track.src = streamingUrl; // Cache the URL
        audioRef.current.src = streamingUrl;
        await audioRef.current.play();
      } else {
        // Local track (fallback for existing local files)
        audioRef.current.src = track.src;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('Error playing track:', err);
      setError(err instanceof Error ? err.message : 'Failed to play track');
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
    refreshAlbums
  };
};
