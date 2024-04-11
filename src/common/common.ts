export const shuffle = (list: unknown[]) => {
  let index = list.length;

  while (index > 0) {
    const newIndex = Math.floor(Math.random() * list.length);
    index--;

    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
  }

  return list;
};
