import { AlbumListProps } from './interfaceAlbumList';
import { Track } from './interfaceDisplay';
import { BackendAlbum, apiService } from '../services/api';

// Transform backend album structure to frontend structure
export const transformBackendAlbums = async (backendData: BackendAlbum): Promise<AlbumListProps[]> => {
  const albums: AlbumListProps[] = [];

  for (const artist in backendData) {
    for (const albumName in backendData[artist]) {
      const tracks: Track[] = backendData[artist][albumName].map((songFileName: string) => {
        // Extract song title from filename (remove extension and track number)
        const title = songFileName
          .replace(/^\d+\s*-\s*/, '') // Remove track number prefix
          .replace(/\.[^/.]+$/, '') // Remove file extension
          .replace(new RegExp(`^${artist}\\s*-\\s*`, 'i'), '') // Remove artist prefix if present
          .trim();

        return {
          album: albumName,
          title,
          artist,
          src: '', // Will be populated when track is played
          key: `${artist}/${albumName}/${songFileName}` // S3 key without albums/ prefix (backend will add it)
        };
      });

      albums.push({
        author: artist,
        album: albumName,
        thumbnail: '', // You can add logic to fetch album artwork later
        tracks
      });
    }
  }

  return albums;
};

// Get streaming URL for a track
export const getTrackStreamingUrl = async (track: Track): Promise<string> => {
  if (!track.key) {
    throw new Error('Track does not have a valid key for streaming');
  }
  
  return await apiService.getSongUrl(track.key);
};

// Clean up filename to get a proper song title
export const cleanSongTitle = (filename: string, artist?: string): string => {
  let title = filename;
  
  // Remove file extension
  title = title.replace(/\.[^/.]+$/, '');
  
  // Remove track number prefix (e.g., "01 - ", "1. ", etc.)
  title = title.replace(/^\d+\s*[-.\s]+\s*/, '');
  
  // Remove artist name if it appears at the beginning
  if (artist) {
    const artistRegex = new RegExp(`^${artist}\\s*[-\\s]+`, 'i');
    title = title.replace(artistRegex, '');
  }
  
  return title.trim();
};
