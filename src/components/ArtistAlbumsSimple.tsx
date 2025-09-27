import React from 'react';
import Image from 'next/image';
import { Artist } from '@/utils/interfaceArtist';
import { AlbumListProps } from '@/utils/interfaceAlbumList';
import defaultThumbnail from '../data/default-music-image.png';

interface ArtistAlbumsSimpleProps {
  artist: Artist;
  onAlbumSelect: (album: AlbumListProps) => void;
  onBackToList: () => void;
}

export const ArtistAlbumsSimple: React.FC<ArtistAlbumsSimpleProps> = ({
  artist,
  onAlbumSelect,
  onBackToList
}) => {
  return (
    <section className="artistAlbumsSimple">
      {/* Header with back button */}
      <div className="artistAlbumsSimple__header">
        <button 
          className="artistAlbumsSimple__backButton"
          onClick={onBackToList}
        >
          ← Back to Albums
        </button>
        <div className="artistAlbumsSimple__info">
          <h2>{artist.name}</h2>
          <p>{artist.albums.length} albums • {artist.totalTracks} tracks</p>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="artistAlbumsSimple__grid">
        {artist.albums.map((album, index) => (
          <article 
            key={index}
            className="artistAlbumsSimple__album"
            onClick={() => onAlbumSelect(album)}
          >
            <div className="artistAlbumsSimple__imageContainer">
              <Image
                src={album.thumbnail || defaultThumbnail}
                alt={`${album.album} artwork`}
                width={200}
                height={200}
                className="artistAlbumsSimple__image"
              />
              <div className="artistAlbumsSimple__overlay">
                <span className="artistAlbumsSimple__playIcon">▶</span>
              </div>
            </div>
            
            <div className="artistAlbumsSimple__albumInfo">
              <h3>{album.album}</h3>
              <p>{album.tracks.length} tracks</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
