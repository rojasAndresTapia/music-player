// API service for connecting with the music backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface BackendAlbum {
  [artist: string]: {
    [album: string]: string[];
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
    try {
      const response = await fetch(`${this.baseUrl}/song?key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SongUrlResponse = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting song URL:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
