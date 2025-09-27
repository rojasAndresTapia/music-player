// API service for connecting with the music backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface BackendAlbum {
  [artist: string]: {
    [album: string]: {
      tracks: string[];
      images: string[];
    };
  };
}

export interface SongUrlResponse {
  url: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchAlbums(): Promise<BackendAlbum> {
    try {
      const response = await fetch(`${this.baseUrl}/albums`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  }

  async getSongUrl(key: string): Promise<string> {
    // Use the audio proxy endpoint directly instead of signed URLs
    return `${this.baseUrl}/audio-proxy?key=${encodeURIComponent(key)}`;
  }

  async getImageUrl(key: string): Promise<string> {
    // Use the image proxy endpoint directly instead of signed URLs
    return `${this.baseUrl}/image-proxy?key=${encodeURIComponent(key)}`;
  }
}

export const apiService = new ApiService();
