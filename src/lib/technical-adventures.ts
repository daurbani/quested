import data from "../../data/technical-adventures.json";
export type TechnicalAdventure={activity:string;experienceLevel:"Accessible"|"Developing"|"Experienced"|"Advanced"|"Expert";technicalGrade:string;protection:string;pitches:number;commitment:string;requiredSkills:string[];keyHazards:string[];routeInfoUrl:string;routeInfoSource:string};
const adventures=data as Record<string,TechnicalAdventure>;
export function getTechnicalAdventure(slug:string){return adventures[slug];}
