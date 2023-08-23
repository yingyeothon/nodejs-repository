import { Repository } from "..";
import { Versioned } from "./versioned";

interface KeyValues<V> {
  [key: string]: V;
}

export class MapDocument<V = string> {
  constructor(
    private readonly repository: Repository,
    private readonly tupleKey: string
  ) {}

  public async insertOrUpdate(key: string, value: V | undefined) {
    return this.edit((values) => {
      if (!value) {
        const copied = { ...values };
        delete copied[key];
        return copied;
      }
      return { ...values, [key]: value };
    });
  }

  public async delete(key: string) {
    return this.insertOrUpdate(key, undefined);
  }

  public async truncate() {
    return this.repository.delete(this.tupleKey);
  }

  public async read() {
    const actual = await this.repository.get<Versioned<KeyValues<V>>>(
      this.tupleKey
    );
    return this.ensureDocument(actual);
  }

  public async edit(modifier: (input: KeyValues<V>) => KeyValues<V>) {
    const doc = await this.read();
    const newDoc = {
      content: modifier(doc.content),
      version: doc.version + 1,
    };
    await this.repository.set(this.tupleKey, newDoc);
    return newDoc;
  }

  public async view<U>(selector: (input: KeyValues<V>) => U) {
    return selector((await this.read()).content);
  }

  private ensureDocument(
    doc: Versioned<KeyValues<V>> | undefined
  ): Versioned<KeyValues<V>> {
    const version = doc && doc.version ? doc.version : 0;
    const content = doc && doc.content ? doc.content : {};
    return { version, content };
  }
}
