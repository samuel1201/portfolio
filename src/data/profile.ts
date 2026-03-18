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
    '專長 Web UI 與前端協作，能在設計階段納入元件化思維，讓設計到開發的轉換更順暢。',
  email: 'samuel1201@gmail.com',
  links: {
    behance: 'https://www.behance.net/samuel1201',
    github: 'https://github.com/samuel1201',
    linkedin: 'https://www.linkedin.com/in/samuel-wang-3a987bb1/',
    cv: '/samuel_portfolio.pdf',
  },
  skillGroups: [
    { title: 'Design', items: ['Photoshop', 'Illustrator', 'Lightroom', 'Figma'] },
    {
      title: 'Front-end',
      items: ['HTML', 'CSS', 'GSAP', 'JavaScript (Basic)', 'React CSS', 'Styled-Components'],
    },
    { title: 'Tools', items: ['Git', 'Cursor'] },
  ],
  projects: [
    {
      title: '歷年作品集',
      description: '收錄不同階段的視覺與品牌專案，呈現從概念到落地的完整設計思維。',
      year: '2026',
      tags: ['Portfolio'],
      href: '/samuel_portfolio.pdf',
      img: '/images/projects/project-07.jpg',
    },
    {
      title: '煊揚科技企業視覺系統',
      description: '以品牌識別為核心，整合標誌、色彩與應用規範，建立一致且可延伸的企業視覺語言。',
      year: '2015',
      tags: ['Visual System'],
      href: 'https://www.behance.net/gallery/76754457/Xsail-VI-design-2019',
      img: '/images/projects/project-01.jpg',
    },
    {
      title: '力晶科技家庭日',
      description: '從 UI 與插畫視覺設計到前端網頁製作，完整打造符合企業活動需求的網站體驗。',
      year: '2016',
      tags: ['Web UI Design'],
      href: 'https://www.behance.net/gallery/43620733/Web-PowerChip-2016',
      img: '/images/projects/project-02.png',
    },
    {
      title: '設計小班制',
      description: '為團體設計專屬 logo，透過造形與識別語彙整合，建立清楚且具記憶點的品牌形象。',
      year: '2019',
      tags: ['Logo Design'],
      href: 'https://www.behance.net/gallery/59869679/-logo',
      img: '/images/projects/project-03.jpg',
    },
    {
      title: '悠遊卡',
      description: '為企業設計悠遊卡封面，做出符合品牌形象、也好辨識的票卡視覺。',
      year: '2017',
      tags: ['Graphic Design'],
      href: 'https://www.behance.net/gallery/55838971/EASYCARD-Design-2017',
      img: '/images/projects/project-04.jpg',
    },
    {
      title: '企業佈展視覺設計_India',
      description: '為企業設計佈展視覺，涵蓋平面設計、3D 模型與展覽主視覺。',
      year: '2017',
      tags: ['Branding System'],
      href: 'https://www.behance.net/gallery/60185877/Booth-C4D-modeling-and-graphic-design',
      img: '/images/projects/project-05.jpg',
    },
    {
      title: '企業佈展視覺設計_Las Vegas',
      description: '為企業設計佈展視覺，涵蓋平面設計、3D 模型與展覽主視覺。',
      year: '2016',
      tags: ['Branding System'],
      href: 'https://www.behance.net/gallery/49603505/Exhibition-NAB-2017',
      img: '/images/projects/project-06.png',
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

