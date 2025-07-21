export const objectLogger = (obj: Record<string, any>) => {
  for (const [key, value] of Object.entries(obj)) {
    console.log(`${key}: ${value}`);
  }
};
