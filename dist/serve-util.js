import fs from 'fs';
import Handlebars from 'handlebars';
export function getView(viewName) {
    return fs.readFileSync(`views/${viewName}.hbs`, 'utf8');
}
export function render(template, data) {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(data);
}
