import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import robots from "lume/plugins/robots.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import seo from "lume/plugins/seo.ts";
import mdx from "lume/plugins/mdx.ts";
import rehypePrettyCode from "rehype-pretty-code"
import { CodeFigure } from "@/includes/code.tsx"

const site = lume({
  src: './site',
  location: new URL('https://jacobb.nyc'),
});

site.use(jsx());
site.use(mdx({
  rehypePlugins: [
    [rehypePrettyCode, {
      theme: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      keepBackground: false,
    }]
  ],
  components: {
    figure: CodeFigure
  }
}));
site.use(robots());
site.use(slugify_urls());
site.use(metas());
site.use(sitemap());
site.use(seo());

site.add('./assets/scripts', '/scripts')
site.add('./assets/styles', '/styles')
site.add('./assets/favicon.ico')
site.add('./assets/img', '/img')

export default site;
