import { DomainType } from "@/types";

export interface TasteCategoryDimension {
  id: string;
  domain: DomainType;
  categoryLabel: string; // e.g. "Music"
  dimensionLabel: string; // e.g. "Artist / Band"
  placeholder: string; // e.g. "e.g. Radiohead, A.R. Rahman, Daft Punk"
  tagType: string;
}

export const TASTE_DIMENSIONS: TasteCategoryDimension[] = [
  // MUSIC
  {
    id: "music_artist",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Artist / Band",
    placeholder: "e.g. Radiohead, A.R. Rahman, Daft Punk, Tame Impala...",
    tagType: "artist"
  },
  {
    id: "music_song",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Song / Track",
    placeholder: "e.g. Bohemian Rhapsody, Starboy, Kun Faya Kun...",
    tagType: "song"
  },
  {
    id: "music_genre",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Genre (e.g. Indie Rock, Lo-fi)",
    placeholder: "e.g. Shoegaze, Synthwave, Hip-Hop, Classical, Qawwali...",
    tagType: "genre"
  },
  {
    id: "music_language",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Language / Region",
    placeholder: "e.g. Hindi, Japanese City Pop, Spanish Indie, Korean, French...",
    tagType: "language"
  },

  // MOVIES & CINEMA
  {
    id: "movie_title",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Movie / Film Title",
    placeholder: "e.g. Interstellar, Spirited Away, Parasite, Chungking Express...",
    tagType: "movie"
  },
  {
    id: "movie_director",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Director / Filmmaker",
    placeholder: "e.g. Christopher Nolan, Hayao Miyazaki, Denis Villeneuve...",
    tagType: "director"
  },
  {
    id: "movie_actor",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Actor / Performer",
    placeholder: "e.g. Cillian Murphy, Shah Rukh Khan, Timothée Chalamet...",
    tagType: "actor"
  },
  {
    id: "movie_genre",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Genre (Sci-Fi, Noir, Anime)",
    placeholder: "e.g. Psychological Thriller, Cyberpunk Sci-Fi, Neo-Noir...",
    tagType: "genre"
  },

  // BOOKS & LITERATURE
  {
    id: "book_title",
    domain: "book",
    categoryLabel: "Books",
    dimensionLabel: "Book Title",
    placeholder: "e.g. Dune, Kafka on the Shore, Sapiens, 1984...",
    tagType: "book"
  },
  {
    id: "book_author",
    domain: "book",
    categoryLabel: "Books",
    dimensionLabel: "Author / Philosopher",
    placeholder: "e.g. Haruki Murakami, Albert Camus, Ted Chiang, Fyodor Dostoevsky...",
    tagType: "author"
  },
  {
    id: "book_genre",
    domain: "book",
    categoryLabel: "Books",
    dimensionLabel: "Genre (Philosophy, Hard Sci-Fi)",
    placeholder: "e.g. Existential Philosophy, Speculative Fiction, Magical Realism...",
    tagType: "genre"
  },

  // VIDEO GAMES
  {
    id: "game_title",
    domain: "video_game",
    categoryLabel: "Games",
    dimensionLabel: "Game Title",
    placeholder: "e.g. Elden Ring, Portal 2, Hollow Knight, Cyberpunk 2077...",
    tagType: "video_game"
  },
  {
    id: "game_genre",
    domain: "video_game",
    categoryLabel: "Games",
    dimensionLabel: "Game Genre",
    placeholder: "e.g. Souls-like, Immersive Sim, Roguelike Deckbuilder, JRPG...",
    tagType: "genre"
  },

  // DINING, CAFES & RESTAURANTS
  {
    id: "dining_cuisine",
    domain: "place",
    categoryLabel: "Dining & Cafes",
    dimensionLabel: "Favorite Cuisine Type",
    placeholder: "e.g. Authentic Ramen, South Indian Dosa, Neapolitan Pizza, Tapas...",
    tagType: "cuisine"
  },
  {
    id: "dining_vibe",
    domain: "place",
    categoryLabel: "Dining & Cafes",
    dimensionLabel: "Vibe / Ambiance (Study Cafe, Late-night)",
    placeholder: "e.g. Quiet specialty coffee for studying, Cozy retro bakery, Rooftop...",
    tagType: "vibe"
  },
  {
    id: "dining_name",
    domain: "place",
    categoryLabel: "Dining & Cafes",
    dimensionLabel: "Specific Restaurant / Cafe Name",
    placeholder: "e.g. Blue Bottle Coffee, Tim Hortons, The Barn Berlin...",
    tagType: "place"
  }
];
