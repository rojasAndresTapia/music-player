import { AlbumListProps } from '@/utils/interfaceAlbumList';
import Image from 'next/image';
import React from 'react';
import defaultThumbnail from '../data/default-music-image.png';
import { albums } from '@/data/tracks';
import { Search } from './Search';




interface AlbumsListProps {
  albums: AlbumListProps[];
  onAlbumSelect?: (album: AlbumListProps) => void;
}

export const AlbumsList: React.FC<AlbumsListProps> = ({ albums, onAlbumSelect }) => {
  const [albumList, setAlbumList] = React.useState<AlbumListProps[]>([]);
  const [currentAlbumIndex, setCurrentAlbumIndex] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // Filter albums based on search term (only filter if 2+ characters)
  const filteredAlbums = React.useMemo(() => {
    if (searchTerm.length < 2) {
      return albums; // Show all albums if search term is less than 2 characters
    }
    
    return albums.filter(album => 
      album.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.album.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [albums, searchTerm]);

  const handleClickAlbum = (albumIndex: number) => {
    console.log("albumIndex", albumIndex);
    setCurrentAlbumIndex(albumIndex);
    // Use filtered albums instead of original albums
    const selectedAlbum = filteredAlbums[albumIndex];

    // Call the onAlbumSelect callback if provided
    if (onAlbumSelect) {
      onAlbumSelect(selectedAlbum);
    }

    if (selectedAlbum.tracks.length > 0) {
      // Obtiene la primera canción del álbum
      const firstTrack = selectedAlbum.tracks[0];
      console.log("firstTrack", firstTrack);

      // Reproduce la primera canción
      // Debes usar tu lógica específica para reproducir canciones aquí
      // Puede ser mediante el uso de un reproductor de audio o una función personalizada.
    }
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };
  return (
    <section className="albumsContainer">
      <section>
        <p>Albums</p>
        
        {/* Search Component */}
        <Search 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Search albums or artists..."
        />
        
        {/* Albums Grid */}
        <div className="albumGrid">
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album, index) => {
              return (
                <article key={index} className="album" onClick={() => handleClickAlbum(index)}>
                  <h3>{album.author}</h3>
                  <h4>{album.album}</h4>
                  <Image
                    src={album.thumbnail ? album.thumbnail : defaultThumbnail}
                    alt={`Thumbnail for ${album.author}`}
                    width={240}
                    height={240}
                  />
                </article>
              );
            })
          ) : (
            <div className="albumsContainer__noResults">
              <p>No albums found matching "{searchTerm}"</p>
              <p>Try searching for a different artist or album name.</p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};