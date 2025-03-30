export class ObjectTransformer<K extends string | number | symbol> {
  private currentObj: Record<K, K>;

  constructor(obj: Record<K, K>) {
    this.currentObj = obj;
  }

  flip() {
    this.currentObj = Object.entries(this.currentObj).reduce((ret, entry) => {
      const [ key, value ] = entry as [K, K];
      ret[ value ] = key;
      return ret;
    }, {} as Record<K, K>);

    return this;
  }

  // Для явного получения объекта
  toObject(): Record<K, K> {
    return { ...this.currentObj };
  }

  // Автоматическое преобразование в JSON
  toJSON(): Record<K, K> {
    return this.currentObj;
  }

  // Для консоли и строкового представления
  toString(): string {
    return JSON.stringify(this.currentObj);
  }

  // Для автоматического преобразования в примитивные типы
  [Symbol.toPrimitive](hint: string): string | Record<K, K> {
    if (hint === 'string') return this.toString();
    return this.currentObj;
  }
}
