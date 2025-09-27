import React from 'react';
import Image from 'next/image';
import { AlbumListProps } from '@/utils/interfaceAlbumList';
import { Artist } from '@/utils/interfaceArtist';
import { MixedListItem, createSmartMixedList } from '@/utils/dataTransformers';
import { Search } from './Search';
import defaultThumbnail from '../data/default-music-image.png';

interface SmartAlbumsListProps {
  albums: AlbumListProps[];
  onAlbumSelect: (album: AlbumListProps) => void;
  onArtistSelect: (artist: Artist) => void;
}

export const SmartAlbumsList: React.FC<SmartAlbumsListProps> = ({
  albums,
  onAlbumSelect,
  onArtistSelect
}) => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  
  // Create smart mixed list
  const mixedList = React.useMemo(() => {
    return createSmartMixedList(albums);
  }, [albums]);

  // Filter mixed list based on search
  const filteredList = React.useMemo(() => {
    if (searchTerm.length < 2) {
      return mixedList;
    }
    
    return mixedList.filter(item => {
      if (item.type === 'artist' && item.artist) {
        return item.artist.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (item.type === 'album' && item.album) {
        return item.album.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.album.album.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  }, [mixedList, searchTerm]);

  const handleItemClick = (item: MixedListItem) => {
    if (item.type === 'artist' && item.artist) {
      onArtistSelect(item.artist);
    } else if (item.type === 'album' && item.album) {
      onAlbumSelect(item.album);
    }
  };

  return (
    <section className="smartAlbumsList">
      <div className="smartAlbumsList__header">
        <h2>Music Library ({filteredList.length})</h2>
        
        <Search 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search artists or albums..."
        />
      </div>
      
      <div className="smartAlbumsList__grid">
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <article 
              key={index}
              className={`smartAlbumsList__card smartAlbumsList__card--${item.type}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="smartAlbumsList__imageContainer">
                {item.type === 'artist' && item.artist ? (
                  // Artist card with multiple album images
                  <div className={`smartAlbumsList__artistImages smartAlbumsList__artistImages--${Math.min(item.artist.albums.length, 4)}`}>
                    {item.artist.albums.slice(0, 4).map((album, albumIndex) => (
                      <div 
                        key={albumIndex}
                        className={`smartAlbumsList__albumThumbnail smartAlbumsList__albumThumbnail--${albumIndex + 1}`}
                      >
                        <Image
                          src={album.thumbnail || defaultThumbnail}
                          alt={`${album.album} artwork`}
                          width={100}
                          height={100}
                          className="smartAlbumsList__thumbnailImage"
                        />
                      </div>
                    ))}
                    
                    {/* Show "+X more" if there are more than 4 albums */}
                    {item.artist.albums.length > 4 && (
                      <div className="smartAlbumsList__moreAlbums">
                        +{item.artist.albums.length - 4}
                      </div>
                    )}
                  </div>
                ) : (
                  // Single album image
                  <Image
                    src={item.album?.thumbnail || defaultThumbnail}
                    alt={`${item.album?.album} artwork`}
                    width={200}
                    height={200}
                    className="smartAlbumsList__image"
                  />
                )}
                
                <div className="smartAlbumsList__overlay">
                  <span className="smartAlbumsList__playIcon">▶</span>
                </div>
                
                {/* Badge to indicate if it's an artist with multiple albums */}
                {item.type === 'artist' && (
                  <div className="smartAlbumsList__badge">
                    {item.artist?.albums.length} albums
                  </div>
                )}
              </div>
              
              <div className="smartAlbumsList__info">
                <h3 className="smartAlbumsList__title">
                  {item.type === 'artist' ? item.artist?.name : item.album?.album}
                </h3>
                <p className="smartAlbumsList__subtitle">
                  {item.type === 'artist' 
                    ? `${item.artist?.totalTracks} tracks`
                    : `${item.album?.author} • ${item.album?.tracks.length} tracks`
                  }
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="smartAlbumsList__noResults">
            <p>No results found for "{searchTerm}"</p>
            <p>Try searching for a different artist or album.</p>
          </div>
        )}
      </div>
    </section>
  );
};
