import { defineField, defineType } from "sanity";

export const showreelSection = defineType({
  name: "showreelSection",
  title: "🎬 Showreel Section",
  type: "object",
  fields: [
    defineField({
      name: "heading_en",
      title: "Heading (English)",
      type: "string",
      initialValue: "Watch My Showreel",
      description: "Main heading for the showreel section in English.",
    }),
    defineField({
      name: "heading_ar",
      title: "Heading (Arabic)",
      type: "string",
      initialValue: "شاهد ريل الأعمال",
      description: "Main heading for the showreel section in Arabic.",
    }),
    defineField({
      name: "subtitle_en",
      title: "Subtitle (English)",
      type: "string",
      initialValue: "A glimpse into my creative world",
      description: "Subtitle text displayed below the heading in English.",
    }),
    defineField({
      name: "subtitle_ar",
      title: "Subtitle (Arabic)",
      type: "string",
      initialValue: "لمحة من عالمي الإبداعي",
      description: "Subtitle text displayed below the heading in Arabic.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "The background/cover image shown behind the play button.",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "string",
      description:
        "Paste a YouTube (e.g. https://youtu.be/ID), Vimeo (e.g. https://vimeo.com/ID), or direct video URL (.mp4). The player will auto-detect the type.",
    }),
  ],
  preview: {
    select: {
      media: "coverImage",
      url: "videoUrl",
    },
    prepare({ url }: { url?: string }) {
      return {
        title: "🎬 Showreel Section",
        subtitle: url ? `Video: ${url.slice(0, 50)}…` : "No video URL set",
      };
    },
  },
});
