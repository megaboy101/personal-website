import { albums } from "./_data/photography.ts";

export default function*() {
  for (const [title, photos] of albums.entries()) {
    const page = {
      url: `/photos/${title}`,
      title,
      content: '',
      pics: photos,
      layout: 'layouts/photo-album.tsx'
    }
    yield page;
  }
}
