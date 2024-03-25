import { Card } from "./components/Card";
import { Sentence } from "./components/Group";

export const PUBLIC_JSON_PATH = "/json";
export const ROOT_LOCAL_STORAGE_PATH = "/myapp/common-phrases";
export const GROUP_NAMES = [
  "common_expressions.json",
  "greetings.json",
  "travel_directions.json",
  "number_money.json",
  "location.json",
  "phone_internet_email.json",
  "time_dates.json",
  "accommodations.json",
  "dining.json",
  "making_friends.json",
  "intertainment.json",
  "shopping.json",
  "communication_difficulties.json",
  "emergency_health.json",
  "general_questions.json",
  "work.json",
  "weather.json",
  "miscellaneous.json",
];

export function getGroupName(name: string) {
  return `${ROOT_LOCAL_STORAGE_PATH}/${name}`;
}

export function seedLocalStorage(
  groupNames: string[],
  sourceJsonPath: string,
  localStoragePath: string
) {
  for (const groupName of groupNames) {
    const groupPathLocalStorage = localStoragePath + "/" + groupName;
    const group = localStorage.getItem(groupPathLocalStorage);
    if (!group) {
      fetch(`${sourceJsonPath}/${groupName}`)
        .then((res) => res.json())
        .then((arr) => {
          localStorage.setItem(groupPathLocalStorage, JSON.stringify(arr));
        });
    }
  }
}

export function getGroupByName(name: string) {
  if (!name) return [];

  const strGroup = localStorage.getItem(ROOT_LOCAL_STORAGE_PATH + "/" + name);
  if (strGroup) {
    return JSON.parse(strGroup);
  }
  return [];
}

export function setGroupByName(name: string, data: object[]) {
  if (!name || !data) return false;

  localStorage.setItem(
    ROOT_LOCAL_STORAGE_PATH + "/" + name,
    JSON.stringify(data)
  );
}

export function updateSentencesByGroupName(name: string, sentences: any[]) {
  if (!name || !sentences) return false;

  const groupName = getGroupName(name);
  const strGroup = localStorage.getItem(groupName);
  if (!strGroup) {
    return;
  }

  const group: any[] = JSON.parse(strGroup);

  // update meawning and state
  for (const sentence of sentences) {
    const item = group.find((d) => d.sentence === sentence.sentence);
    if (!item) {
      continue;
    }

    item.meaning = sentence.meaning;
    item.state = sentence.state;
  }

  localStorage.setItem(groupName, JSON.stringify(group));
}
// 0 => 1, 1 => 2, 2 => 2
const PASSED = [1, 2, 2];

export function saveState(
  groupName: string,
  cards: Card[],
  sentences: Sentence[]
) {
  if (cards.length === 0) {
    return sentences;
  }
  const newSentences = sentences.map((item) => {
    const card = cards.find((c) => c.sentence === item.sentence);
    if (!card) {
      return item;
    }

    let state = item.state || 0;
    state = card.isHidden ? PASSED[state] : 0;
    item.state = state;
    return item;
  });
  updateSentencesByGroupName(groupName, newSentences);

  return newSentences;
}
