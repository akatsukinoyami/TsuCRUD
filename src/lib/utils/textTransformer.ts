import { ObjectTransformer } from "./objectTransformer";

const pluralExceptions: Record<string, string> = {
  child: 'children',
  person: 'people',
  man: 'men',
  woman: 'women',
  tooth: 'teeth',
  foot: 'feet',
  mouse: 'mice'
};

const singularExceptions = new ObjectTransformer<string>(pluralExceptions).flip().toObject();

export class TextTransformer {
  private currentText: string;

  constructor(text: string) {
    this.currentText = text;
  }

  capitalize(): this {
    const words = this.splitIntoWords();
    this.currentText = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return this;
  }

  humanize(): this {
    const words = this.splitIntoWords();
    this.currentText = words.join(' ');
    return this;
  }

  pluralize(): this {
    const words = this.splitIntoWords();
    this.currentText = words.map(word => {
      // Проверка исключений
      const lowerWord = word.toLowerCase();
      if (pluralExceptions[lowerWord]) {
        return pluralExceptions[lowerWord];
      }

      // Базовые правила
      if (/(s|sh|ch|x|z)$/i.test(word)) return word + 'es';
      if (/fe?$/i.test(word)) return word.replace(/fe?$/i, 'ves');
      if (/[^aeiou]y$/i.test(word)) return word.replace(/y$/i, 'ies');
      return word + 's';
    }).join(' ');
    
    return this;
  }

  singularize(): this {
    const words = this.splitIntoWords();
    this.currentText = words.map(word => {
      // Проверка исключений
      const lowerWord = word.toLowerCase();
      if (singularExceptions[lowerWord]) {
        return singularExceptions[lowerWord];
      }

      // Базовые правила
      if (/ies$/i.test(word)) return word.replace(/ies$/i, 'y');
      if (/(ss|sh|ch|x|z)es$/i.test(word)) return word.replace(/es$/i, '');
      if (/ves$/i.test(word)) return word.replace(/ves$/i, 'f');
      if (/s$/.test(word)) return word.replace(/s$/i, '');
      return word;
    }).join(' ');
    
    return this;
  }

  toSnakeCase(): this {
    const words = this.splitIntoWords();
    this.currentText = words.join('_');
    return this;
  }

  toCamelCase(): this {
    const words = this.splitIntoWords();
    this.currentText = words
      .map((word, index) => 
        index === 0 
          ? word.toLowerCase() 
          : word[0].toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
    return this;
  }

  toUpperCase(): this {
    this.currentText = this.currentText.toUpperCase();
    return this;
  }

  toLowerCase(): this {
    this.currentText = this.currentText.toLowerCase();
    return this;
  }

  toString(): string {
    return this.currentText;
  }

  valueOf(): string {
    return this.currentText;
  }

  [Symbol.toPrimitive](hint: string): string {
    return this.currentText;
  }

  private splitIntoWords(): string[] {
    return this.currentText
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0);
  }
}