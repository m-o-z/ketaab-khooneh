// ./src/schema/authors.ts
import { z } from "zod";

import PocketBasePublicService from "@/services/PocketBasePublicService";

import type { BookWorkDB } from "./bookWorks"; // Use 'import type' for the type
import { BookWorkDBSchema } from "./bookWorks"; // Use regular import for the schema value
import { FlexibleDateTime } from "./common/date";

// 1. Define the TypeScript types first to break the dependency cycle.
export type AuthorDB = {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  bio: string | null;
  email: string;
  author_img: string | null;
  nick_name: string | null;
  created: Date | string;
  updated: Date | string;
  expand?: {
    books?: BookWorkDB[]; // Reference the TYPE here
  };
};

export type AuthorCore = {
  id: string;
  name: string;
  bio: string | null;
  email: string;
  authorImg: string;
  nickName: string | null;
  created: Date | string;
  updated: Date | string;
};

// 2. Define the Zod schemas and explicitly annotate them with the types.
export const AuthorDBSchema: z.ZodType<AuthorDB> = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  name: z.string().min(3).max(50),
  bio: z.string().min(10).max(250).nullable(),
  email: z.string().email().or(z.literal("")),
  author_img: z.string().nullable(),
  nick_name: z.string().nullable(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
  expand: z
    .object({
      // 3. Use z.lazy with the SCHEMA const here.
      books: z.lazy(() => z.array(BookWorkDBSchema)),
    })
    .optional(),
});

export const AuthorCoreSchema: z.ZodType<AuthorCore, z.ZodTypeDef, AuthorDB> =
  AuthorDBSchema.transform((data) => {
    let { author_img: authorImg } = data;
    const {
      id,
      name,
      bio,
      email,
      created,
      updated,
      nick_name: nickName = "",
    } = data;

    if (authorImg) {
      authorImg = PocketBasePublicService.Client().files.getURL(
        data,
        authorImg,
      );
    }

    return {
      id,
      name,
      bio,
      email,
      authorImg: authorImg ?? "/public/default/authorImage",
      nickName,
      created,
      updated,
    };
  });

// Your DTOs can remain as they are, but it's good practice to base them on the Core type/schema
export const AuthorDTOSchema = z.custom<AuthorCore>().transform((data) => data);
export type AuthorDTO = z.infer<typeof AuthorDTOSchema>;

export const AuthorBriefDTOSchema = z.custom<AuthorCore>().transform((data) => {
  const { created, updated, bio, ...response } = data;
  void created;
  void bio;
  void updated;

  return response;
});

export type AuthorBriefDTO = z.infer<typeof AuthorBriefDTOSchema>;
