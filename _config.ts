import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import robots from "lume/plugins/robots.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import seo from "lume/plugins/seo.ts";

const site = lume({
  src: './site'
});

site.use(jsx());
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
