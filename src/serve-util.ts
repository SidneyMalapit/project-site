import fs from 'fs';
import Handlebars from 'handlebars';

export function getView(viewName: string): string {
  return fs.readFileSync(`views/${viewName}.hbs`, 'utf8');
}

export function render(template: string, data?: object): string {
  return Handlebars.compile(template)(data);
}
