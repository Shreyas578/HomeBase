import { DomainType } from "@/types";

export interface TasteCategoryDimension {
  id: string;
  domain: DomainType;
  categoryLabel: string;
  dimensionLabel: string;
  placeholder: string;
  tagType: string;
  popularSuggestions: string[];
}

export const TASTE_DIMENSIONS: TasteCategoryDimension[] = [
  // MUSIC
  {
    id: "music_artist",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Artist / Band",
    placeholder: "Search or type artist (e.g. Radiohead, A.R. Rahman, Daft Punk)...",
    tagType: "artist",
    popularSuggestions: [
      "Radiohead",
      "A.R. Rahman",
      "Daft Punk",
      "Tame Impala",
      "Pink Floyd",
      "The Weeknd",
      "Arctic Monkeys",
      "Kendrick Lamar",
      "Taylor Swift",
      "Coldplay",
      "Lana Del Rey",
      "Arijit Singh",
      "Cigarettes After Sex",
      "Phoebe Bridgers",
      "Mac DeMarco",
      "Deftones",
      "Nirvana",
      "Fleetwood Mac",
      "Frank Ocean",
      "Tyler, The Creator"
    ]
  },
  {
    id: "music_song",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Song / Track",
    placeholder: "Search or type song (e.g. Bohemian Rhapsody, Starboy)...",
    tagType: "song",
    popularSuggestions: [
      "Bohemian Rhapsody",
      "Starboy",
      "Kun Faya Kun",
      "Creep",
      "Let It Happen",
      "Blinding Lights",
      "Midnight City",
      "Karma Police",
      "Chamber of Reflection",
      "Comfortably Numb",
      "Apocalypse",
      "Hotel California",
      "Sweater Weather",
      "Space Song",
      "Die For You"
    ]
  },
  {
    id: "music_genre",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Genre (Indie Rock, Lo-fi, Electronic)",
    placeholder: "Search or type genre (e.g. Shoegaze, Synthwave, Hip-Hop)...",
    tagType: "genre",
    popularSuggestions: [
      "Shoegaze / Dream Pop",
      "Synthwave / Retrowave",
      "Indie Rock / Alt-Rock",
      "Lo-Fi Beats / Study",
      "Hip-Hop / R&B",
      "Techno / Deep House",
      "Classical / Baroque",
      "Qawwali / Sufi",
      "Psychedelic Rock",
      "Post-Punk / Darkwave",
      "Math Rock / Mid-West Emo",
      "Bossa Nova / Jazz",
      "Ambient / Downtempo"
    ]
  },
  {
    id: "music_language",
    domain: "artist",
    categoryLabel: "Music",
    dimensionLabel: "Language / Regional Sound",
    placeholder: "Search or type regional music (e.g. Japanese City Pop, Hindi)...",
    tagType: "language",
    popularSuggestions: [
      "Japanese City Pop",
      "Hindi / Bollywood Indie",
      "K-Pop & Korean R&B",
      "Spanish Indie / Latin Pop",
      "French Indie Pop",
      "Punjabi Pop & Folk",
      "Tamil & Malayalam Cinema Sounds",
      "Arabic Indie & Tarab",
      "Afrobeats & Amapiano",
      "Nordic Folk & Ambient"
    ]
  },

  // CINEMA
  {
    id: "movie_title",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Movie / Film Title",
    placeholder: "Search or type film (e.g. Interstellar, Spirited Away, Parasite)...",
    tagType: "movie",
    popularSuggestions: [
      "Interstellar",
      "Spirited Away",
      "Parasite",
      "Chungking Express",
      "Inception",
      "Blade Runner 2049",
      "Everything Everywhere All at Once",
      "Pulp Fiction",
      "La La Land",
      "Whiplash",
      "The Grand Budapest Hotel",
      "Fight Club",
      "Eternal Sunshine of the Spotless Mind",
      "Princess Mononoke",
      "The Dark Knight",
      "Oppenheimer",
      "Past Lives",
      "Your Name (Kimi no Na wa)",
      "2001: A Space Odyssey",
      "Amélie"
    ]
  },
  {
    id: "movie_director",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Director / Filmmaker",
    placeholder: "Search or type director (e.g. Christopher Nolan, Hayao Miyazaki)...",
    tagType: "director",
    popularSuggestions: [
      "Christopher Nolan",
      "Hayao Miyazaki",
      "Denis Villeneuve",
      "Quentin Tarantino",
      "Wes Anderson",
      "Wong Kar-wai",
      "Bong Joon-ho",
      "Stanley Kubrick",
      "Martin Scorsese",
      "David Fincher",
      "Guillermo del Toro",
      "Makoto Shinkai",
      "Greta Gerwig",
      "Satyajit Ray",
      "Park Chan-wook",
      "Alfred Hitchcock"
    ]
  },
  {
    id: "movie_actor",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Actor / Performer",
    placeholder: "Search or type actor (e.g. Cillian Murphy, Timothée Chalamet)...",
    tagType: "actor",
    popularSuggestions: [
      "Cillian Murphy",
      "Timothée Chalamet",
      "Shah Rukh Khan",
      "Leonardo DiCaprio",
      "Florence Pugh",
      "Christian Bale",
      "Keanu Reeves",
      "Emma Stone",
      "Ryan Gosling",
      "Song Kang-ho",
      "Tom Hanks",
      "Meryl Streep",
      "Zendaya",
      "Irrfan Khan",
      "Willem Dafoe"
    ]
  },
  {
    id: "movie_genre",
    domain: "movie",
    categoryLabel: "Cinema",
    dimensionLabel: "Film Genre / Style",
    placeholder: "Search or type genre (e.g. Psychological Thriller, Cyberpunk)...",
    tagType: "genre",
    popularSuggestions: [
      "Psychological Thriller",
      "Cyberpunk Sci-Fi",
      "Neo-Noir / Crime",
      "Studio Ghibli / Anime",
      "Coming-of-Age / Drama",
      "Dystopian / Post-Apocalyptic",
      "Magical Realism",
      "Black Comedy / Satire",
      "Documentary & Biopic",
      "Art House / Surrealist"
    ]
  },

  // BOOKS & LITERATURE
  {
    id: "book_title",
    domain: "book",
    categoryLabel: "Books",
    dimensionLabel: "Book Title",
    placeholder: "Search or type book (e.g. Dune, Kafka on the Shore, 1984)...",
    tagType: "book",
    popularSuggestions: [
      "Dune",
      "Kafka on the Shore",
      "1984",
      "Sapiens: A Brief History of Humankind",
      "The Stranger (L'Étranger)",
      "Brave New World",
      "Crime and Punishment",
      "The Alchemist",
      "Norwegian Wood",
      "Stories of Your Life and Others",
      "The Hitchhiker's Guide to the Galaxy",
      "Neuromancer",
      "Project Hail Mary",
      "Atomic Habits",
      "The Three-Body Problem"
    ]
  },
  {
    id: "book_author",
    domain: "book",
    categoryLabel: "Books",
    dimensionLabel: "Author / Philosopher",
    placeholder: "Search or type author (e.g. Haruki Murakami, Albert Camus)...",
    tagType: "author",
    popularSuggestions: [
      "Haruki Murakami",
      "Albert Camus",
      "Ted Chiang",
      "Fyodor Dostoevsky",
      "George Orwell",
      "Yuval Noah Harari",
      "Frank Herbert",
      "Gabriel García Márquez",
      "Franz Kafka",
      "Friedrich Nietzsche",
      "Marcus Aurelius",
      "Liu Cixin",
      "Ursula K. Le Guin",
      "Neil Gaiman",
      "Virginia Woolf"
    ]
  },
  {
    id: "book_genre",
    domain: "book",
    categoryLabel: "Books",
    dimensionLabel: "Literary Genre",
    placeholder: "Search or type genre (e.g. Existential Philosophy, Hard Sci-Fi)...",
    tagType: "genre",
    popularSuggestions: [
      "Existential Philosophy",
      "Hard Sci-Fi / Speculative",
      "Magical Realism",
      "Dystopian Fiction",
      "Historical Non-Fiction",
      "Psychology & Human Behavior",
      "Classic Literature",
      "Postmodern Literature",
      "Fantasy & Worldbuilding",
      "Poetry & Anthology"
    ]
  },

  // VIDEO GAMES
  {
    id: "game_title",
    domain: "video_game",
    categoryLabel: "Games",
    dimensionLabel: "Game Title",
    placeholder: "Search or type game (e.g. Elden Ring, Portal 2, Hollow Knight)...",
    tagType: "video_game",
    popularSuggestions: [
      "Elden Ring",
      "Portal 2",
      "Hollow Knight",
      "Cyberpunk 2077",
      "The Legend of Zelda: Breath of the Wild",
      "The Witcher 3: Wild Hunt",
      "Baldur's Gate 3",
      "Red Dead Redemption 2",
      "Hades",
      "Stardew Valley",
      "Dark Souls III",
      "Disco Elysium",
      "NieR: Automata",
      "Half-Life 2",
      "Outer Wilds",
      "Minecraft",
      "Celeste",
      "BioShock"
    ]
  },
  {
    id: "game_genre",
    domain: "video_game",
    categoryLabel: "Games",
    dimensionLabel: "Game Genre",
    placeholder: "Search or type game genre (e.g. Souls-like, Immersive Sim)...",
    tagType: "genre",
    popularSuggestions: [
      "Souls-like / Action RPG",
      "Immersive Sim",
      "Roguelike Deckbuilder",
      "JRPG & Turn-Based",
      "Metroidvania / Platformer",
      "Open-World Exploration",
      "Puzzle / Logic Chamber",
      "Narrative Choice / CRPG",
      "Cozy / Farming Sim",
      "Tactical Shooter / Strategy"
    ]
  },

  // DINING, CAFES & RESTAURANTS
  {
    id: "dining_cuisine",
    domain: "place",
    categoryLabel: "Dining & Cafes",
    dimensionLabel: "Favorite Cuisine Type",
    placeholder: "Search or type cuisine (e.g. Authentic Ramen, South Indian Dosa)...",
    tagType: "cuisine",
    popularSuggestions: [
      "Authentic Japanese Ramen & Udon",
      "South Indian Dosa & Filter Coffee",
      "Authentic Neapolitan Pizza",
      "Korean BBQ & Tteokbokki",
      "Mexican Street Tacos & Mezcal",
      "Vietnamese Pho & Banh Mi",
      "Turkish Kebabs & Baklava",
      "Ethiopian Injera & Stews",
      "Thai Green Curry & Pad Kra Pao",
      "Middle Eastern Mezze & Falafel",
      "Italian Handmade Pasta",
      "Specialty Bakery & French Pastries"
    ]
  },
  {
    id: "dining_vibe",
    domain: "place",
    categoryLabel: "Dining & Cafes",
    dimensionLabel: "Cafe Vibe / Ambiance",
    placeholder: "Search or type vibe (e.g. Quiet specialty study cafe, Late-night)...",
    tagType: "vibe",
    popularSuggestions: [
      "Quiet specialty coffee with WiFi & study desks",
      "Cozy retro bakery with warm lighting",
      "Late-night student diner & tea house",
      "Industrial third-wave espresso bar",
      "Greenery-filled botanical greenhouse cafe",
      "Bustling underground speakeasy bar",
      "Artisan pour-over & vinyl listening bar",
      "Sunny outdoor terrace / beer garden",
      "Budget-friendly campus street food counter"
    ]
  },
  {
    id: "dining_name",
    domain: "place",
    categoryLabel: "Dining & Cafes",
    dimensionLabel: "Specific Restaurant / Cafe Name",
    placeholder: "Search or type venue name (e.g. Blue Bottle, The Barn Berlin)...",
    tagType: "place",
    popularSuggestions: [
      "Blue Bottle Coffee",
      "The Barn Berlin",
      "Tim Hortons",
      "Five Guys",
      "Chipotle",
      "Pret A Manger",
      "Honest Greens",
      "Joe & The Juice",
      "Dishoom",
      "Ichiran Ramen",
      "Wagamama",
      "Starbucks Reserve",
      "Gregorys Coffee"
    ]
  }
];
