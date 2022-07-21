const META_URL = "https://shin.is-a.dev/react-mise"
const META_TITLE = "React Mise"
const META_DESCRIPTION =
  "Intuitive, type safe, light and flexible Store for React"
const META_IMAGE = "https://shin.is-a.dev/react-mise/react-mise.png"

import { defineConfig } from "vitepress"

export default defineConfig({
  base: "/react-mise/",
  markdown: {
    attrs: {
      leftDelimiter: "%{",
      rightDelimiter: "}%"
    }
  },
  title: "React Mise",
  lang: "en-US",
  description: "The React Store that you will enjoy using",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/react-mise/react-mise.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/react-mise/react-mise.png" }],

    [
      "meta",
      {
        property: "og:type",
        content: "website"
      }
    ],
    [
      "meta",
      {
        property: "og:url",
        content: META_URL
      }
    ],
    [
      "meta",
      {
        property: "og:title",
        content: META_TITLE
      }
    ],
    [
      "meta",
      {
        property: "og:description",
        content: META_DESCRIPTION
      }
    ],
    [
      "meta",
      {
        property: "og:image",
        content: META_IMAGE
      }
    ],
    [
      "meta",
      {
        property: "twitter:card",
        content: "summary_large_image"
      }
    ],
    [
      "meta",
      {
        property: "twitter:url",
        content: META_URL
      }
    ],
    [
      "meta",
      {
        property: "twitter:title",
        content: META_TITLE
      }
    ],
    [
      "meta",
      {
        property: "twitter:description",
        content: META_DESCRIPTION
      }
    ],
    [
      "meta",
      {
        property: "twitter:image",
        content: META_IMAGE
      }
    ],

    [
      "link",
      {
        rel: "preload",
        href: "/dank-mono.css",
        as: "style",
        onload: "this.onload=null;this.rel='stylesheet'"
      }
    ]
  ],

  themeConfig: {
    repo: "tachibana-shin/react-mise",
    logo: "/react-mise.svg",
    docsDir: "docs",
    docsBranch: "v2",
    editLinks: true,
    editLinkText: "Suggest changes to this page",

    // algolia: {},

    nav: [
      { text: "Guide", link: "/introduction.html" },
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: "Links",
        items: [
          {
            text: "Twitter",
            link: "https://twitter.com/tachib_shin"
          },
          {
            text: "Changelog",
            link: "https://github.com/tachibana-shin/react-mise/blob/v2/packages/react-mise/CHANGELOG.md"
          }
        ]
      }
    ],

    sidebar: {
      // catch-all fallback
      "/": [
        {
          text: "Introduction",
          children: [
            {
              text: "What is React Mise?",
              link: "/introduction.html"
            },
            {
              text: "Getting Started",
              link: "/getting-started.html"
            }
          ]
        },
        {
          text: "Core Concepts",
          children: [
            { text: "Defining a Store", link: "/core-concepts/" },
            { text: "State", link: "/core-concepts/state.html" },
            { text: "Getters", link: "/core-concepts/getters.html" },
            { text: "Actions", link: "/core-concepts/actions.html" },
            { text: "Plugins", link: "/core-concepts/plugins.html" },
            {
              text: "Stores outside of components",
              link: "/core-concepts/outside-component-usage.html"
            }
          ]
        },
        {
          text: "Server-Side Rendering (SSR)",
          children: [
            {
              text: "Vue and Vite",
              link: "/ssr/"
            },
            {
              text: "Nuxt.js",
              link: "/ssr/nuxt.html"
            }
          ]
        },
        {
          text: "Cookbook",
          link: "/cookbook/",
          children: [
            {
              text: "Migration from Redux",
              link: "/cookbook/migration-redux.html"
            },
            {
              text: "Composing Stores",
              link: "/cookbook/composing-stores.html"
            }
          ]
        }
      ]
    }
  }
})
