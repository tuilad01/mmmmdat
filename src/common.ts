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
