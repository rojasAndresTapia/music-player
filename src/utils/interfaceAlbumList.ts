import { Track } from './interfaceDisplay';
import { StaticImageData } from 'next/image';

export interface AlbumListProps {
    author: string;
    album: string;
    thumbnail?: StaticImageData | string;
    tracks: Track[];
  }