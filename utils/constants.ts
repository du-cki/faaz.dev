import GithubLogoVue from '~/components/logos/GithubLogo.vue'
import DiscordLogoVue from '~/components/logos/DiscordLogo.vue'
import MailLogoVue from '~/components/logos/MailLogo.vue'
import KeyLogoVue from '~/components/logos/KeyLogo.vue'

// this is just a basic mapping of language: color,
// its main purpose is cosmetic only but i'd like to get a better solution in the future.
const languageColourMapping = {
  rust: '#DEA584',
  python: '#FFD43B',
  html: '#E34C26',
  javascript: '#F0DB4F',
  typescript: '#3178C6',
  vue: '#41B883',
  css: '#563d7C',
  ruby: '#701516',
  c: '#555555',
  emacs_lisp: '#C065DB',
  'c#': '#178600',
  'c++': '#F34B7D'
}

const socials: Array<{
  hoverText: string
  icon: any
  url: string
}> = [
  {
    hoverText: '@du-cki',
    icon: GithubLogoVue,
    url: 'https://github.com/du-cki'
  },
  {
    hoverText: '@du_cki',
    icon: DiscordLogoVue,
    url: 'https://discord.com/users/651454696208465941'
  },
  {
    hoverText: 'meow@faaz.dev',
    icon: MailLogoVue,
    url: 'mailto:meow@faaz.dev'
  },
  {
    hoverText: 'Public Key',
    icon: KeyLogoVue,
    url: '/key.pbk'
  }
]

export {
  languageColourMapping,
  socials
}
