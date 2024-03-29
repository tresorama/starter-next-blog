import { z } from "zod";
import { Logger } from "./utils/utils.logger";

const blogPostSchema = z.object({
  /** Thrse fields are required! Don't edit unless you know what you are doing */
  slug: z.string(),
  title: z.string(),
  contentAsHTMLString: z.string(),
}).extend({
  /* Add here your front-matter markdown custom fields */
  excerpt: z.string(),
  coverImage: z.string().nullable(),
  date: z.string().datetime(),
  author: z.object({
    name: z.string(),
    picture: z.string().nullable(),
  }),
});

/**
 * The `BlogPost` type used in the "view" side of the app.
 * Every `BlogPostDatasource` must returns this type when used.
 */
export type BlogPost = z.infer<typeof blogPostSchema>;

// Validation
export const validateBlogPostOrThrow = (blogPost: BlogPost) => {
  const result = blogPostSchema.safeParse(blogPost);
  if (result.success) return;
  const logger = new Logger("BlogPost Not Valid");
  const errorMessage = logger.error(
    "BlogPost slug: " + blogPost.slug,
    "Some attributes of the blogpost are not valid, usually means that blogpost frontmatter has something wrong.",
    result.error,
  );
  throw new Error(errorMessage);
};