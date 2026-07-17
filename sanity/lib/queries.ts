import { defineQuery } from "next-sanity";

export const homepageQuery = defineQuery(`
  *[_type == "homepage"][0] {
    pageBuilder[] {
      ...,
      _type == "projectsGridSection" => {
        heading_en, heading_ar, subtitle_en, subtitle_ar, showFilters, maxProjects, layout,
        categories[] { title_en, title_ar, value },
        "projects": *[_type == "project"] | order(order asc, date desc) {
          _id, title, title_ar, slug, category, description_en, description_ar, date, tools, 
          thumbnail { asset->{ url } },
          hoverType, 
          hoverVideo { asset->{ url } }, 
          "galleryImages": mediaGallery[_type == "image"] { asset->{ url } }
        }
      },
      _type == "testimonialSection" => {
        heading_en, heading_ar, subtitle_en, subtitle_ar, speed,
        "testimonials": selectedTestimonials[]-> {
          _id, reviewType, name_en, name_ar, role_en, role_ar, text_en, text_ar, rating,
          chatScreenshot { asset->{ url } }
        }
      },
      _type == "aboutSection" => {
        heading_en, heading_ar, subtitle_en, subtitle_ar, showStats, showVideo,
        profileImage { asset->{ url } }, cvFile { asset->{ url } }, statistics[] { value, label_en, label_ar }
      },
      _type == "experienceSection" => {
        heading_en, heading_ar, subtitle_en, subtitle_ar, showTechStack, showTimeline, showCompanyLogo,
        jobs[] {
          role_en, role_ar, company_en, company_ar, duration_en, duration_ar, description_en, description_ar, techStack,
          companyLogo { asset->{ url } }
        }
      }
    }
  }
`);

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    ...,
    navLinks[] { title_en, title_ar, href },
    socialLinks[] { platform, url, iconOff { asset->{ url } }, iconOn { asset->{ url } } },
    logoImageLight_en { asset->{ url } },
    logoImageDark_en { asset->{ url } },
    logoImageLight_ar { asset->{ url } },
    logoImageDark_ar { asset->{ url } },
    footerImageLight_en { asset->{ url } },
    footerImageDark_en { asset->{ url } },
    footerImageLight_ar { asset->{ url } },
    footerImageDark_ar { asset->{ url } },
    showCopyright,
    keywords_en,
    keywords_ar,
    ogImage { asset->{ url } }
  }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, title_ar, slug, category, date, detailsLayout,
    description_en, description_ar, caseStudy_en, caseStudy_ar,
    thumbnail { asset->{ url } },
    mediaGallery[] { _type, url, asset->{ url } },
    tools[] { name, icon { asset->{ url } } }
  }
`);

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(order asc, date desc) {
    _id, title, title_ar, slug, category, 
    thumbnail { asset->{ url } }, 
    hoverType, 
    hoverVideo { asset->{ url } }, 
    "galleryImages": mediaGallery[_type == "image"] { asset->{ url } }
  }
`);

export const aboutQuery = defineQuery(`*[_type == "about"][0] { bio_en, bio_ar, profileVideoLoop, profileImage, stats, cvFile }`);
export const experiencesQuery = defineQuery(`*[_type == "experience"] | order(order asc) { _id, company, role_en, role_ar, startDate, endDate, current, description_en, description_ar, tools }`);