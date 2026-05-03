import { defineQuery } from "next-sanity";

/* ═══════════════════════════════════════════
    HOMEPAGE PAGE BUILDER
    ═══════════════════════════════════════════ */

export const homepageQuery = defineQuery(`
  *[_type == "homepage"][0] {
    pageBuilder[] {
      ...,
      _type == "projectsGridSection" => {
        "projects": *[_type == "project"] | order(order asc, date desc) {
          _id,
          title,
          title_ar,
          slug,
          category,
          description_en,
          description_ar,
          date,
          tools,
          thumbnail {
            asset->{
              url
            }
          }
        }
      }
    }
  }
`);

/* ═══════════════════════════════════════════
    SITE SETTINGS + THEME COLORS (التعديل هنا)
    ═══════════════════════════════════════════ */

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteTitle,
    metaDescription_en,
    metaDescription_ar,
    whatsappNumber,
    socialLinks[] {
      platform,
      url,
      iconImage {
        asset->{
          url
        }
      }
    },
    lightBackground,
    lightSurface,
    lightPrimary,
    lightTextPrimary,
    lightTextSecondary,
    darkBackground,
    darkSurface,
    darkPrimary,
    darkTextPrimary,
    darkTextSecondary
  }
`);

/* ═══════════════════════════════════════════
    PROJECTS
    ═══════════════════════════════════════════ */

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(order asc, date desc) {
    _id,
    title,
    title_ar,
    slug,
    thumbnail {
      asset->{
        url
      }
    },
    hoverVideo,
    category,
    description_en,
    description_ar,
    date,
    featured,
    tools
  }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    title_ar,
    slug,
    thumbnail {
      asset->{
        url
      }
    },
    hoverVideo,
    category,
    description_en,
    description_ar,
    date,
    videoEmbed,
    gallery[] {
      asset->{
        url
      }
    },
    caseStudy_en,
    caseStudy_ar,
    tools
  }
`);

/* ═══════════════════════════════════════════
    ABOUT
    ═══════════════════════════════════════════ */

export const aboutQuery = defineQuery(`
  *[_type == "about"][0] {
    bio_en,
    bio_ar,
    profileVideoLoop,
    profileImage,
    stats,
    cvFile
  }
`);

/* ═══════════════════════════════════════════
    EXPERIENCE
    ═══════════════════════════════════════════ */

export const experiencesQuery = defineQuery(`
  *[_type == "experience"] | order(order asc) {
    _id,
    company,
    role_en,
    role_ar,
    startDate,
    endDate,
    current,
    description_en,
    description_ar,
    tools
  }
`);