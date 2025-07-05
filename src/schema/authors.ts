import { z } from "zod";
import { FlexibleDateTime } from "./common/date";
import pbClient from "@/client/pbClient";

export const AuthorDBSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  name: z.string().min(3).max(50),
  bio: z.string().min(10).max(250).nullable(),
  email: z.string().email().or(z.literal("")),
  author_img: z.string().nullable(), // In PocketBase, file fields typically return a string (filename or URL)
  nick_name: z.string().nullable(),
  created: FlexibleDateTime,
  updated: FlexibleDateTime,
});

export type AuthorDB = z.infer<typeof AuthorDBSchema>;

export const AuthorCoreSchema = AuthorDBSchema.transform((data) => {
  let {
    id,
    name,
    bio,
    email,
    created,
    updated,
    author_img: authorImg,
    nick_name: nickName = "",
  } = data;

  if (authorImg) {
    authorImg = pbClient().files.getURL(data, authorImg);
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

export type AuthorCore = z.infer<typeof AuthorCoreSchema>;

export const AuthorDTOSchema = z.custom<AuthorCore>().transform((data) => {
  return data;
});

export type AuthorDTO = z.infer<typeof AuthorDTOSchema>;

export const AuthorBriefDTOSchema = z.custom<AuthorCore>().transform((data) => {
  const { id, name, email, authorImg: img } = data;
  return {
    id,
    name,
    email,
    img,
  };
});

export type AuthorBriefDTO = z.infer<typeof AuthorBriefDTOSchema>;
