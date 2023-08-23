import { Repository } from "..";
import { Versioned } from "./versioned";

export type Values<V> = V[];

export class ListDocument<V = string> {
  constructor(
    private readonly repository: Repository,
    private readonly tupleKey: string
  ) {}

  public async insert(value: V) {
    return this.edit((values) => [...values, value]);
  }

  public async deleteIf(filter: (input: V) => boolean) {
    return this.edit((values) => values.filter((value) => !filter(value)));
  }

  public async truncate() {
    return this.repository.delete(this.tupleKey);
  }

  public async read() {
    const actual = await this.repository.get<Versioned<Values<V>>>(
      this.tupleKey
    );
    return this.ensureDocument(actual);
  }

  public async edit(modifier: (input: V[]) => V[]) {
    const doc = await this.read();
    const newDoc = {
      content: modifier(doc.content),
      version: doc.version + 1,
    };
    await this.repository.set(this.tupleKey, newDoc);
    return newDoc;
  }

  public async view<U>(selector: (input: V[]) => U) {
    return selector((await this.read()).content);
  }

  private ensureDocument(
    doc: Versioned<Values<V>> | undefined
  ): Versioned<Values<V>> {
    const version = doc && doc.version ? doc.version : 0;
    const content = doc && doc.content ? doc.content : [];
    return { version, content };
  }
}
