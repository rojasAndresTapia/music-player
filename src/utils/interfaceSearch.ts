export interface SearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}
