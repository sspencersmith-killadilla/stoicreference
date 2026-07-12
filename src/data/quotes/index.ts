export type Quote = {
  id: string;
  text: string;
  author:
    | "Zeno of Citium"
    | "Cleanthes"
    | "Chrysippus"
    | "Panaetius of Rhodes"
    | "Posidonius"
    | "Cato the Younger"
    | "Seneca"
    | "Musonius Rufus"
    | "Epictetus"
    | "Marcus Aurelius"
    | "Cicero"
    | "Diogenes Laertius"
    | "Hierocles";
  work: string;
  section: string;
  translator?: string;
  themes: string[];
};

import { MARCUS_QUOTES } from "./marcus";
import { SENECA_LETTER_QUOTES } from "./seneca-letters";
import { SENECA_ESSAY_QUOTES } from "./seneca-essays";
import { EPICTETUS_ENCHIRIDION_QUOTES } from "./epictetus-enchiridion";
import { EPICTETUS_DISCOURSES_QUOTES } from "./epictetus-discourses";
import { MUSONIUS_QUOTES } from "./musonius";
import { EARLY_STOIC_QUOTES } from "./early-stoics";
import { OTHER_SOURCE_QUOTES } from "./other-sources";

export const QUOTES: Quote[] = [
  ...MARCUS_QUOTES,
  ...SENECA_LETTER_QUOTES,
  ...SENECA_ESSAY_QUOTES,
  ...EPICTETUS_ENCHIRIDION_QUOTES,
  ...EPICTETUS_DISCOURSES_QUOTES,
  ...MUSONIUS_QUOTES,
  ...EARLY_STOIC_QUOTES,
  ...OTHER_SOURCE_QUOTES,
];
