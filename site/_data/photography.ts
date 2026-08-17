import { walk } from "@std/fs";

const folderPath = 'site/assets/img/photography';

const albums = new Map<string, string[]>();
let currentFolder: string | undefined = undefined;

try {
  for await (const entry of walk(folderPath)) {
    if (entry.isDirectory && entry.name !== 'photography') {
      albums.set(entry.name, []);
      currentFolder = entry.name;
    }

    else if (entry.isFile) {
      const collection = albums.get(currentFolder!) ?? [];
      const newCollection = [...collection, `/img/photography/${currentFolder}/${entry.name}`]
      albums.set(currentFolder!, newCollection)
    }
  }
} catch (error) {
  console.error("Error walking directory:", error);
}

export { albums }
