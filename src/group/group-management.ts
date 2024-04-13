export class GroupManagement {
  static readonly prefixGroupId = "/myapp/common-phrases/";
  private readonly assetJsonUrl = "/json";
  readonly groupNames = [
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

  constructor() {}

  getGroupNames() {
    const groupNames = this.getAllGroupKeys().map((key) =>
      key.replace(GroupManagement.prefixGroupId, "")
    );
    groupNames.sort();
    return groupNames;
  }

  getAllGroupKeys(): string[] {
    const keys = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key) {
        continue;
      }

      if (!key.startsWith(GroupManagement.prefixGroupId)) {
        continue;
      }

      keys.push(key);
    }

    return keys;
  }

  removeAllGroups() {
    const keys = this.getAllGroupKeys();
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  }

  getAllGroups() {
    const keys = this.getAllGroupKeys();
    const groups = [];
    for (const key of keys) {
      const strGroup = localStorage.getItem(key);
      if (strGroup) {
        const group = JSON.parse(strGroup);
        groups.push({
          name: key.replace(GroupManagement.prefixGroupId, ""),
          data: group,
        });
      }
    }

    return groups;
  }

  setAllGroups(groups: { name: string; data: any[] }[]) {
    for (const group of groups) {
      localStorage.setItem(
        GroupManagement.prefixGroupId + group.name,
        JSON.stringify(group.data)
      );
    }
  }

  seed() {
    for (const groupName of this.groupNames) {
      const groupPathLocalStorage = GroupManagement.prefixGroupId + groupName;
      const group = localStorage.getItem(groupPathLocalStorage);
      if (!group) {
        fetch(`${this.assetJsonUrl}/${groupName}`)
          .then((res) => res.json())
          .then((arr: any[]) => {
            // just insert 40 sentence for each group
            // EX: If there are 60 sentence, we will split 2 groups or 100 sentence => 3 group
            const groups = Math.ceil(arr.length / 40);
            for (let index = 0; index < groups; index++) {
              const key = index
                ? `${groupPathLocalStorage.replace(".json", `_${index}.json`)}`
                : groupPathLocalStorage;
              localStorage.setItem(key, JSON.stringify(arr.splice(0, 40)));
            }
          });
      }
    }
  }
}
