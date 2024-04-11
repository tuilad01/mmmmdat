import { GroupManagement } from "./group-management";

export interface Sentence {
  sentence: string;
  meaning: string;
  state: number;
}

export interface IGroup {
  getSentences({ isLocal }: { isLocal?: boolean }): Sentence[];
  getSentence({ sentence }: { sentence: string }): Sentence | undefined;
  add(sentence: Sentence): boolean;
  remove(sentence: Sentence): boolean;
  update(sentence: Sentence): boolean;
  updateNextState(lose: string[], remembered: Sentence[]): void;
  save(): void;
}

export class Group implements IGroup {
  private key: string = "";
  private sentences: Sentence[] | undefined = undefined;

  constructor({ name, sentences }: { name: string; sentences?: Sentence[] }) {
    this.key = `${GroupManagement.prefixGroupId}${name}`;
    if (sentences) {
      this.sentences = sentences;
    }
  }
  updateNextState(lose: string[], remembered: Sentence[]): void {
    if (!this.sentences) {
      return;
    }
    const nextState = [1, 2, 2];

    for (const sentence of this.sentences) {
      if (lose.indexOf(sentence.sentence) >= 0) {
        sentence.state = 0;
      } else if (remembered.some((r) => r.sentence === sentence.sentence)) {
        sentence.state = nextState[sentence.state || 0];
      }
    }
  }

  private loadLocalStorage(key: string) {
    const strGroup = localStorage.getItem(key);
    if (!strGroup) {
      return [];
    }
    const sentences = JSON.parse(strGroup) as Sentence[];
    return sentences;
  }

  setSentences(sentences: Sentence[]) {
    this.sentences = sentences;
  }

  getName() {
    return this.key.replace(GroupManagement.prefixGroupId, "");
  }

  loadSentences() {
    this.sentences = this.loadLocalStorage(this.key);
    return this;
  }

  getSentences({ isLocal = true }: { isLocal?: boolean }) {
    if (isLocal) {
      this.sentences = this.loadLocalStorage(this.key);
    }

    return this.sentences || [];
  }

  getSentence({ sentence }: { sentence: string }) {
    return this.sentences?.find((d) => d.sentence == sentence);
  }

  add(sentence: Sentence) {
    const item = this.sentences?.find((d) => d.sentence === sentence.sentence);
    if (item) {
      return false;
    }

    this.sentences?.push(sentence);
    return true;
  }

  remove(sentence: Sentence) {
    const index = this.sentences?.findIndex(
      (d) => d.sentence === sentence.sentence
    );

    if (index === undefined || index < 0) {
      return false;
    }

    this.sentences?.splice(index, 1);
    return true;
  }

  update(sentence: Sentence) {
    const item = this.sentences?.find((d) => d.sentence === sentence.sentence);

    if (!item) {
      return false;
    }

    item.meaning = sentence.meaning;
    return true;
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.sentences));
  }
}
