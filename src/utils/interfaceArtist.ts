import { AlbumListProps } from './interfaceAlbumList';
import { StaticImageData } from 'next/image';

export interface Artist {
  name: string;
  albums: AlbumListProps[];
  thumbnail?: StaticImageData | string; // Use the first album's artwork or a default
  totalTracks: number;
}

export interface ArtistViewProps {
  artists: Artist[];
  onArtistSelect: (artist: Artist) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export interface ArtistAlbumsProps {
  artist: Artist;
  onAlbumSelect: (album: AlbumListProps) => void;
  onBackToArtists: () => void;
  onTrackSelect?: (track: any, trackIndex: number) => void;
}

export interface NavigationState {
  view: 'artists' | 'albums' | 'tracks';
  selectedArtist?: Artist;
  selectedAlbum?: AlbumListProps;
}
