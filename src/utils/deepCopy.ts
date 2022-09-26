export const deepCopy = <T>(oldObject: T): T =>
  JSON.parse(JSON.stringify(oldObject));
