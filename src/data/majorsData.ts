export interface AcademicMajorOption {
  category: string;
  name: string;
}

export const ACADEMIC_MAJORS: AcademicMajorOption[] = [
  // Computer Science & Tech
  { category: "Computer Science & Information", name: "Computer Science" },
  { category: "Computer Science & Information", name: "Software Engineering" },
  { category: "Computer Science & Information", name: "Artificial Intelligence & Machine Learning" },
  { category: "Computer Science & Information", name: "Data Science & Analytics" },
  { category: "Computer Science & Information", name: "Cybersecurity & Information Assurance" },
  { category: "Computer Science & Information", name: "Human-Computer Interaction (HCI)" },
  { category: "Computer Science & Information", name: "Information Systems" },
  { category: "Computer Science & Information", name: "Cloud Computing & DevOps" },
  { category: "Computer Science & Information", name: "Game Development & Interactive Media" },

  // Engineering
  { category: "Engineering", name: "Mechanical Engineering" },
  { category: "Engineering", name: "Electrical & Computer Engineering" },
  { category: "Engineering", name: "Civil & Environmental Engineering" },
  { category: "Engineering", name: "Biomedical Engineering" },
  { category: "Engineering", name: "Aerospace Engineering" },
  { category: "Engineering", name: "Chemical Engineering" },
  { category: "Engineering", name: "Robotics & Mechatronics Engineering" },
  { category: "Engineering", name: "Industrial & Systems Engineering" },
  { category: "Engineering", name: "Materials Science & Engineering" },

  // Natural Sciences & Math
  { category: "Natural Sciences & Mathematics", name: "Physics & Applied Physics" },
  { category: "Natural Sciences & Mathematics", name: "Mathematics & Applied Math" },
  { category: "Natural Sciences & Mathematics", name: "Statistics & Probability" },
  { category: "Natural Sciences & Mathematics", name: "Chemistry & Biochemistry" },
  { category: "Natural Sciences & Mathematics", name: "Biology & Molecular Biology" },
  { category: "Natural Sciences & Mathematics", name: "Neuroscience" },
  { category: "Natural Sciences & Mathematics", name: "Earth & Atmospheric Sciences" },
  { category: "Natural Sciences & Mathematics", name: "Genetics & Genomics" },

  // Business & Economics
  { category: "Business & Economics", name: "Business Administration & Management" },
  { category: "Business & Economics", name: "Finance & Quantitative Finance" },
  { category: "Business & Economics", name: "Economics" },
  { category: "Business & Economics", name: "Marketing & Digital Strategy" },
  { category: "Business & Economics", name: "Accounting" },
  { category: "Business & Economics", name: "International Business" },
  { category: "Business & Economics", name: "Supply Chain & Logistics Management" },
  { category: "Business & Economics", name: "Entrepreneurship & Innovation" },

  // Medicine & Healthcare
  { category: "Medicine & Health Sciences", name: "Medicine (MD / MBBS)" },
  { category: "Medicine & Health Sciences", name: "Nursing" },
  { category: "Medicine & Health Sciences", name: "Pharmacy & Pharmacology" },
  { category: "Medicine & Health Sciences", name: "Public Health & Epidemiology" },
  { category: "Medicine & Health Sciences", name: "Dentistry" },
  { category: "Medicine & Health Sciences", name: "Physical Therapy & Kinesiology" },

  // Arts, Design & Architecture
  { category: "Design, Arts & Architecture", name: "Architecture" },
  { category: "Design, Arts & Architecture", name: "Urban Planning & Design" },
  { category: "Design, Arts & Architecture", name: "Graphic Design & Visual Communication" },
  { category: "Design, Arts & Architecture", name: "Industrial & Product Design" },
  { category: "Design, Arts & Architecture", name: "Fine Arts & Studio Art" },
  { category: "Design, Arts & Architecture", name: "Film, Video & Photographic Arts" },
  { category: "Design, Arts & Architecture", name: "Music Production & Sound Design" },
  { category: "Design, Arts & Architecture", name: "Digital Media & Animation" },

  // Social Sciences & Law
  { category: "Social Sciences & Law", name: "Law / Legal Studies" },
  { category: "Social Sciences & Law", name: "Psychology" },
  { category: "Social Sciences & Law", name: "Political Science & International Relations" },
  { category: "Social Sciences & Law", name: "Sociology" },
  { category: "Social Sciences & Law", name: "Anthropology" },
  { category: "Social Sciences & Law", name: "Philosophy, Politics & Economics (PPE)" },
  { category: "Social Sciences & Law", name: "Communications & Media Studies" },
  { category: "Social Sciences & Law", name: "Journalism" },

  // Humanities & Languages
  { category: "Humanities & Languages", name: "Philosophy" },
  { category: "Humanities & Languages", name: "History" },
  { category: "Humanities & Languages", name: "English Literature & Creative Writing" },
  { category: "Humanities & Languages", name: "Linguistics" },
  { category: "Humanities & Languages", name: "Modern Foreign Languages & Literature" },
  { category: "Humanities & Languages", name: "Comparative Literature" }
];
