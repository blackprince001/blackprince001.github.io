import projectsJson from "../data/featured-projects.json";
import publicationsJson from "../data/publications.json";
import readingJson from "../data/reading.json";
import {
  projectSchema,
  publicationSchema,
  readingSchema,
  type Project,
  type Publication,
} from "./content-model";

export const projects: Project[] = projectSchema.array().parse(projectsJson);
export const publications: Publication[] = publicationSchema.array().parse(publicationsJson);
export const reading = readingSchema.parse(readingJson);
