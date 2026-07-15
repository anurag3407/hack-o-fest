export interface LineupMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bgText: string;
  link: string;
  imageTransform?: {
    x: number;
    y: number;
    scale: number;
  };
  mobileTransform?: {
    x: number;
    y: number;
    scale: number;
  };
}

export const LINEUP_MEMBERS: LineupMember[] = [
  {
    id: 1,
    name: 'Harshit Verma',
    role: 'President',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780598014/Remove_background_project_-_June_05_2026_at_00.02.11_bkobue.png',
    bgText: 'LEAD',
    link: '#',
    imageTransform: { x: 0, y: 0, scale: 3.0 },
    mobileTransform: { x: -10, y: -20, scale: 3.2},
  },
  {
    id: 2,
    name: 'Anurag Tiwari',
    role: 'Web Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780647960/bg-removed-images/itjvrx6uxeqqvrdxdcq1.png',
    bgText: 'BUILD',
    link: '#',
    imageTransform: { x: 19, y: 25, scale: 2.0 },
    mobileTransform: { x: 19, y: 25, scale: 2.0 },
  },
  {
    id: 3,
    name: 'Anantam Aftab',
    role: 'CP Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780648005/bg-removed-images/eraupkltniv0hib17bql.png',
    bgText: 'CODE',
    link: '#',
    imageTransform: { x: 0, y: 0, scale: 1.1 },
    mobileTransform: { x: 0, y: -10, scale: 1.1 },
  },
  {
    id: 4,
    name: 'Anurag Mishra',
    role: 'Dev Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780651812/WhatsApp_Image_2026-06-05_at_14.07.14_2_avhznh.png',
    bgText: 'HACK',
    link: '#',
    imageTransform: { x: 5, y: 90, scale: 1.7},
    mobileTransform: { x: 10, y: 120, scale: 1.7 },
  },
  {
    id: 5,
    name: 'Raj Nandan Upadhyay',
    role: 'PR Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780653031/bg-removed-images/dawvptf6auvldp8yfrl6.png',
    bgText: 'TALK',
    link: '#',
    imageTransform: { x: -20, y: 0, scale: 2.0 },
    mobileTransform: { x: 0, y: 65, scale: 2.0 },
  },
  {
    id: 6,
    name: 'Harsh Chandra',
    role: 'Design Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780648016/bg-removed-images/tf19tewhhhcpln1jgtz2.png',
    bgText: 'SHIP',
    link: '#',
    imageTransform: { x: 0, y: 95, scale: 1.5 },
    mobileTransform: { x: 0, y: 150, scale: 1.5 },
  },
  {
    id: 7,
    name: 'Himanshu Tiwari',
    role: 'AI/ML Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780648028/bg-removed-images/pklcagizjlkx6wm5fttb.png',
    bgText: 'ZONE',
    link: '#',
    imageTransform: { x: 0, y: 0, scale: 1.9 },
    mobileTransform: { x: 0, y: 0, scale: 2 },
  },
  {
    id: 8,
    name: 'Ratnesh Anand',
    role: 'App Lead',
    image: 'https://res.cloudinary.com/dq1fhihvx/image/upload/v1780648048/bg-removed-images/frj9fcuhan7v8jeugep4.png',
    bgText: 'CORE',
    link: '#',
    imageTransform: { x: 0, y: 0, scale: 1.6 },
    mobileTransform: { x: 6, y: 0, scale: 1.7 },
  },
];
