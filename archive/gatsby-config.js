/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jacob Bleser Personal Website`,
        short_name: `Jacob Bleser`,
        start_url: `/`,
        background_color: `#151515`,
        theme_color: `#FFFFFF`,
        display: `standalone`,
        icon: 'src/images/icon.png'
      },
    },
  ],
}
