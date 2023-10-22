import { AuthorType, SiteMetaData } from "@/types";

import { socialProfiles } from "./social-data";

export const BASE_URL =
  `https://${process.env.VERCEL_URL}` ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

export const defaultAuthor: AuthorType = {
  name: "Kaushik Rishi",
  handle: "@kaushik-rishi",
  socialProfiles,
  email: "rishi.cp01@gmail.com",
  website: "https://github.com/kaushik-rishi",
  jobTitle: "Software Engineer",
  company: "Salesforce",
  availableForWork: false,
  location: {
    city: "Hyderabad",
    media: "/hyderabad.jpg",
  },
};

const defaultTitle = `${defaultAuthor.name}'s Public Home 🏡`;
const defaultDescription = `I'm ${defaultAuthor.name}. Trying to be a better software engineer and a happier human everyday 🌴.`;

const siteMetadata: SiteMetaData = {
  title: {
    template: `%s | ${defaultTitle}`,
    default: defaultTitle,
  },
  description: defaultDescription,
  siteRepo: "https://github.com/kaushik-rishi",
  // newsletterProvider: "mailerlite",
  // newsletterUrl: "https://developreneur.davidlevai.com",
  analyticsProvider: "umami",
  defaultTheme: "dark",
  activeAnnouncement: false,
  announcement: {
    buttonText: "",
    link: "https://_blank",
  },
  postsPerPage: 3,
  postsOnHomePage: 3,
  projectsOnHomePage: 4,
};

export default siteMetadata;
