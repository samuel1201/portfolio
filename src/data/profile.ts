export type SkillGroup = {
  title: string;
  items: string[];
};

export type Project = {
  title: string;
  description?: string;
  year?: string;
  tags?: string[];
  href?: string;
  img?: string;
};

export type Profile = {
  name: string;
  summary: string;
  email: string;
  links: {
    behance?: string;
    github?: string;
    linkedin?: string;
    cv?: string;
  };
  skillGroups: SkillGroup[];
  projects: Project[];
};

export type SectionId = 'hero' | 'about' | 'projects' | 'photography' | 'contact';

export type ResumeSection = {
  id: SectionId;
  title: string;
  color: string;
};

export const profile: Profile = {
  name: 'Samuel Wang',
  summary:
    '專長於 Web UI 設計與前端協作流程，熟悉設計稿與前端開發之間的轉換與溝通，能在設計階段就考慮元件化與實作可行性，協助設計與工程團隊建立更順暢的協作方式。',
  email: 'samuel1201@gmail.com',
  links: {
    behance: 'https://www.behance.net/samuel1201',
    github: 'https://github.com/samuel1201',
  },
  skillGroups: [
    { title: 'Frontend', items: ['React', 'TypeScript', 'GSAP'] },
    { title: 'UI Systems', items: ['Component thinking', 'Design handoff', 'Interaction rhythm'] },
  ],
  projects: [
    {
      title: 'Glate APP for iOS',
      year: '2015',
      tags: ['APP UI'],
      href: 'https://www.behance.net/gallery/54236003/Glate-APP-for-iOS-2015',
      img: '',
    },
    {
      title: 'HungryBee APP for iOS',
      year: '2015',
      tags: ['APP UI'],
      href: 'https://www.behance.net/gallery/54235181/HungryBee-APP-for-iOS-2015',
      img: '',
    },
    {
      title: 'Xsail VI design',
      year: '2019',
      tags: ['Branding'],
      href: 'https://www.behance.net/gallery/76754457/Xsail-VI-design-2019',
      img: '',
    },
    {
      title: 'Exhibition NAB',
      year: '2017',
      tags: ['Exhibition'],
      href: 'https://www.behance.net/gallery/49603505/Exhibition-NAB-2017',
      img: '',
    },
    {
      title: 'Booth C4D modeling',
      year: '2017',
      tags: ['3D'],
      href: 'https://www.behance.net/gallery/60185877/Booth-C4D-modeling-and-graphic-design',
      img: '',
    },
    {
      title: 'Web PowerChip',
      year: '2016',
      tags: ['Web UI'],
      href: 'https://www.behance.net/gallery/43620733/Web-PowerChip-2016',
      img: '',
    },
  ],
};

export const resumeSections: ResumeSection[] = [
  // Section order and theme
  { id: 'hero', title: '', color: '#F5F5F5' },
  { id: 'about', title: 'Resume', color: '#1D1D1D' },
  { id: 'projects', title: 'Graphic', color: '#F5F5F5' },
  { id: 'photography', title: 'Photography', color: '#1D1D1D' },
  { id: 'contact', title: 'Contact', color: '#F5F5F5' },
];

