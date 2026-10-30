export interface CountryData {
  name: string;
  code: string;
  flag: string;
  cities: {
    name: string;
    universities: string[];
  }[];
}

export const COUNTRIES_DATA: CountryData[] = [
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    cities: [
      {
        name: "Berlin",
        universities: [
          "Technical University of Berlin (TU Berlin)",
          "Humboldt University of Berlin",
          "Free University of Berlin (FU Berlin)",
          "Berlin University of the Arts (UdK)",
          "ESMT Berlin",
          "Berlin School of Economics and Law (HWR)",
          "HTW Berlin - University of Applied Sciences"
        ]
      },
      {
        name: "Munich",
        universities: [
          "Technical University of Munich (TUM)",
          "Ludwig Maximilian University of Munich (LMU)",
          "Munich University of Applied Sciences (HM)",
          "Munich Business School"
        ]
      },
      {
        name: "Heidelberg",
        universities: [
          "Heidelberg University (Ruprecht Karls)",
          "SRH University Heidelberg"
        ]
      },
      {
        name: "Aachen",
        universities: [
          "RWTH Aachen University",
          "FH Aachen University of Applied Sciences"
        ]
      },
      {
        name: "Frankfurt",
        universities: [
          "Goethe University Frankfurt",
          "Frankfurt School of Finance & Management",
          "Frankfurt University of Applied Sciences"
        ]
      },
      {
        name: "Hamburg",
        universities: [
          "University of Hamburg",
          "Hamburg University of Technology (TUHH)",
          "Hafencity University Hamburg"
        ]
      },
      {
        name: "Stuttgart",
        universities: [
          "University of Stuttgart",
          "University of Hohenheim",
          "Stuttgart Media University (HdM)"
        ]
      },
      {
        name: "Freiburg",
        universities: [
          "University of Freiburg",
          "Freiburg University of Music"
        ]
      }
    ]
  },
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    cities: [
      {
        name: "Boston & Cambridge",
        universities: [
          "Massachusetts Institute of Technology (MIT)",
          "Harvard University",
          "Boston University",
          "Northeastern University",
          "Tufts University"
        ]
      },
      {
        name: "New York City",
        universities: [
          "Columbia University",
          "New York University (NYU)",
          "The City University of New York (CUNY)",
          "Cornell Tech",
          "The New School (Parsons)",
          "Fordham University"
        ]
      },
      {
        name: "San Francisco & Bay Area",
        universities: [
          "Stanford University",
          "University of California, Berkeley (UC Berkeley)",
          "University of San Francisco (USF)",
          "San Francisco State University (SFSU)"
        ]
      },
      {
        name: "Chicago",
        universities: [
          "University of Chicago",
          "Northwestern University",
          "University of Illinois Chicago (UIC)",
          "Illinois Institute of Technology (IIT)"
        ]
      },
      {
        name: "Los Angeles",
        universities: [
          "University of California, Los Angeles (UCLA)",
          "University of Southern California (USC)",
          "California Institute of Technology (Caltech)",
          "Loyola Marymount University"
        ]
      },
      {
        name: "Austin",
        universities: [
          "University of Texas at Austin (UT Austin)",
          "St. Edward's University"
        ]
      },
      {
        name: "Seattle",
        universities: [
          "University of Washington (UW)",
          "Seattle University"
        ]
      },
      {
        name: "Pittsburgh",
        universities: [
          "Carnegie Mellon University (CMU)",
          "University of Pittsburgh"
        ]
      }
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    cities: [
      {
        name: "London",
        universities: [
          "Imperial College London",
          "University College London (UCL)",
          "King's College London (KCL)",
          "London School of Economics (LSE)",
          "Queen Mary University of London",
          "City, University of London",
          "SOAS University of London"
        ]
      },
      {
        name: "Oxford",
        universities: [
          "University of Oxford",
          "Oxford Brookes University"
        ]
      },
      {
        name: "Cambridge",
        universities: [
          "University of Cambridge",
          "Anglia Ruskin University"
        ]
      },
      {
        name: "Edinburgh",
        universities: [
          "University of Edinburgh",
          "Heriot-Watt University",
          "Edinburgh Napier University"
        ]
      },
      {
        name: "Manchester",
        universities: [
          "University of Manchester",
          "Manchester Metropolitan University"
        ]
      },
      {
        name: "Bristol",
        universities: [
          "University of Bristol",
          "University of the West of England (UWE)"
        ]
      }
    ]
  },
  {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    cities: [
      {
        name: "Pune",
        universities: [
          "Savitribai Phule Pune University",
          "COEP Technological University",
          "Symbiosis International University",
          "MIT World Peace University",
          "Bharati Vidyapeeth"
        ]
      },
      {
        name: "Bengaluru",
        universities: [
          "Indian Institute of Science (IISc)",
          "IIIT Bangalore",
          "RV College of Engineering",
          "PES University",
          "BMS College of Engineering",
          "National Law School of India University (NLSIU)"
        ]
      },
      {
        name: "Mumbai",
        universities: [
          "IIT Bombay",
          "University of Mumbai",
          "VJTI Mumbai",
          "NMIMS Mumbai",
          "Tata Institute of Social Sciences (TISS)"
        ]
      },
      {
        name: "Delhi / NCR",
        universities: [
          "IIT Delhi",
          "Delhi University (DU)",
          "Jawaharlal Nehru University (JNU)",
          "Ashoka University",
          "DTU (Delhi Technological University)",
          "IIIT Delhi"
        ]
      },
      {
        name: "Hyderabad",
        universities: [
          "IIT Hyderabad",
          "IIIT Hyderabad",
          "University of Hyderabad",
          "Osmania University",
          "BITS Pilani Hyderabad"
        ]
      },
      {
        name: "Chennai",
        universities: [
          "IIT Madras",
          "Anna University",
          "SRM Institute of Science and Technology",
          "Loyola College"
        ]
      },
      {
        name: "Kolkata",
        universities: [
          "IIT Kharagpur",
          "Jadavpur University",
          "University of Calcutta",
          "St. Xavier's College Kolkata",
          "IIM Calcutta"
        ]
      }
    ]
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    cities: [
      {
        name: "Toronto",
        universities: [
          "University of Toronto (U of T)",
          "York University",
          "Toronto Metropolitan University (Ryerson)",
          "OCAD University"
        ]
      },
      {
        name: "Vancouver",
        universities: [
          "University of British Columbia (UBC)",
          "Simon Fraser University (SFU)",
          "Emily Carr University of Art and Design"
        ]
      },
      {
        name: "Montreal",
        universities: [
          "McGill University",
          "Université de Montréal",
          "Concordia University",
          "HEC Montréal"
        ]
      },
      {
        name: "Waterloo",
        universities: [
          "University of Waterloo",
          "Wilfrid Laurier University"
        ]
      },
      {
        name: "Ottawa",
        universities: [
          "University of Ottawa",
          "Carleton University"
        ]
      }
    ]
  },
  {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    cities: [
      {
        name: "Melbourne",
        universities: [
          "University of Melbourne",
          "Monash University",
          "RMIT University",
          "Deakin University"
        ]
      },
      {
        name: "Sydney",
        universities: [
          "University of Sydney",
          "University of New South Wales (UNSW)",
          "University of Technology Sydney (UTS)",
          "Macquarie University"
        ]
      },
      {
        name: "Brisbane",
        universities: [
          "University of Queensland (UQ)",
          "Queensland University of Technology (QUT)"
        ]
      }
    ]
  },
  {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    cities: [
      {
        name: "Singapore",
        universities: [
          "National University of Singapore (NUS)",
          "Nanyang Technological University (NTU)",
          "Singapore Management University (SMU)",
          "Singapore University of Technology and Design (SUTD)"
        ]
      }
    ]
  },
  {
    name: "Switzerland",
    code: "CH",
    flag: "🇨🇭",
    cities: [
      {
        name: "Zurich",
        universities: [
          "ETH Zurich",
          "University of Zurich (UZH)",
          "Zurich University of the Arts (ZHdK)"
        ]
      },
      {
        name: "Lausanne",
        universities: [
          "EPFL (École Polytechnique Fédérale de Lausanne)",
          "University of Lausanne (UNIL)",
          "IMD Business School"
        ]
      },
      {
        name: "Geneva",
        universities: [
          "University of Geneva",
          "Geneva Graduate Institute (IHEID)"
        ]
      }
    ]
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    cities: [
      {
        name: "Paris",
        universities: [
          "Sorbonne University",
          "École Polytechnique (Institut Polytechnique de Paris)",
          "Sciences Po Paris",
          "PSL University (Paris Sciences et Lettres)",
          "HEC Paris",
          "INSEAD",
          "Université Paris-Saclay"
        ]
      },
      {
        name: "Lyon",
        universities: [
          "ENS de Lyon",
          "University of Lyon",
          "INSA Lyon"
        ]
      }
    ]
  },
  {
    name: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    cities: [
      {
        name: "Amsterdam",
        universities: [
          "University of Amsterdam (UvA)",
          "Vrije Universiteit Amsterdam (VU Amsterdam)"
        ]
      },
      {
        name: "Delft",
        universities: [
          "TU Delft (Delft University of Technology)"
        ]
      },
      {
        name: "Rotterdam",
        universities: [
          "Erasmus University Rotterdam"
        ]
      },
      {
        name: "Eindhoven",
        universities: [
          "Eindhoven University of Technology (TU/e)"
        ]
      }
    ]
  },
  {
    name: "Sweden",
    code: "SE",
    flag: "🇸🇪",
    cities: [
      {
        name: "Stockholm",
        universities: [
          "KTH Royal Institute of Technology",
          "Stockholm University",
          "Karolinska Institute",
          "Stockholm School of Economics"
        ]
      },
      {
        name: "Gothenburg",
        universities: [
          "Chalmers University of Technology",
          "University of Gothenburg"
        ]
      },
      {
        name: "Lund",
        universities: [
          "Lund University"
        ]
      },
      {
        name: "Uppsala",
        universities: [
          "Uppsala University"
        ]
      }
    ]
  },
  {
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    cities: [
      {
        name: "Tokyo",
        universities: [
          "The University of Tokyo (Todai)",
          "Tokyo Institute of Technology (Tokyo Tech)",
          "Waseda University",
          "Keio University"
        ]
      },
      {
        name: "Kyoto",
        universities: [
          "Kyoto University",
          "Doshisha University",
          "Ritsumeikan University"
        ]
      },
      {
        name: "Osaka",
        universities: [
          "Osaka University"
        ]
      }
    ]
  },
  {
    name: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    cities: [
      {
        name: "Seoul",
        universities: [
          "Seoul National University (SNU)",
          "KAIST (Seoul Campus)",
          "Korea University",
          "Yonsei University",
          "Sungkyunkwan University (SKKU)"
        ]
      },
      {
        name: "Daejeon",
        universities: [
          "KAIST (Main Campus)"
        ]
      }
    ]
  },
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    cities: [
      {
        name: "Beijing",
        universities: [
          "Tsinghua University",
          "Peking University"
        ]
      },
      {
        name: "Shanghai",
        universities: [
          "Fudan University",
          "Shanghai Jiao Tong University (SJTU)",
          "Tongji University",
          "NYU Shanghai"
        ]
      },
      {
        name: "Hong Kong",
        universities: [
          "University of Hong Kong (HKU)",
          "Hong Kong University of Science and Technology (HKUST)",
          "Chinese University of Hong Kong (CUHK)"
        ]
      }
    ]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    cities: [
      {
        name: "Dubai",
        universities: [
          "University of Wollongong in Dubai",
          "Middlesex University Dubai",
          "Heriot-Watt University Dubai",
          "American University in Dubai (AUD)"
        ]
      },
      {
        name: "Abu Dhabi",
        universities: [
          "NYU Abu Dhabi",
          "Khalifa University",
          "Sorbonne University Abu Dhabi"
        ]
      }
    ]
  },
  {
    name: "Ireland",
    code: "IE",
    flag: "🇮🇪",
    cities: [
      {
        name: "Dublin",
        universities: [
          "Trinity College Dublin (TCD)",
          "University College Dublin (UCD)",
          "Dublin City University (DCU)",
          "Technological University Dublin"
        ]
      },
      {
        name: "Cork",
        universities: [
          "University College Cork (UCC)"
        ]
      }
    ]
  },
  {
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    cities: [
      {
        name: "Milan",
        universities: [
          "Politecnico di Milano",
          "Bocconi University",
          "University of Milan"
        ]
      },
      {
        name: "Rome",
        universities: [
          "Sapienza University of Rome",
          "Tor Vergata University of Rome"
        ]
      },
      {
        name: "Bologna",
        universities: [
          "University of Bologna"
        ]
      }
    ]
  },
  {
    name: "Spain",
    code: "ES",
    flag: "🇪🇸",
    cities: [
      {
        name: "Madrid",
        universities: [
          "Complutense University of Madrid",
          "Autonomous University of Madrid",
          "IE University",
          "Charles III University of Madrid"
        ]
      },
      {
        name: "Barcelona",
        universities: [
          "University of Barcelona",
          "Autonomous University of Barcelona (UAB)",
          "Pompeu Fabra University",
          "ESADE Business School"
        ]
      }
    ]
  }
];
