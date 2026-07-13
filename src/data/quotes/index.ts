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
import { SENECA_LETTERS_QUOTES } from "./seneca-letters";
import { SENECA_ESSAYS_QUOTES } from "./seneca-essays";
import { EPICTETUS_ENCHIRIDION_QUOTES } from "./epictetus-enchiridion";
import { EPICTETUS_DISCOURSES_QUOTES } from "./epictetus-discourses";
import { MUSONIUS_QUOTES } from "./musonius";
import { EARLY_STOICS_QUOTES } from "./early-stoics";
import { OTHER_SOURCE_QUOTES } from "./other-sources";
import { PASS_C_QUOTES } from "./pass-c";
import { PASS_D_QUOTES } from "./pass-d";

export const QUOTES: Quote[] = [
  ...MARCUS_QUOTES,
  ...SENECA_LETTERS_QUOTES,
  ...SENECA_ESSAYS_QUOTES,
  ...EPICTETUS_ENCHIRIDION_QUOTES,
  ...EPICTETUS_DISCOURSES_QUOTES,
  ...MUSONIUS_QUOTES,
  ...EARLY_STOICS_QUOTES,
  ...OTHER_SOURCE_QUOTES,
  ...PASS_C_QUOTES,
  ...PASS_D_QUOTES,
];
