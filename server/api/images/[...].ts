import { load as cheerio } from 'cheerio'
import { Option } from '~/utils/types'

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

const ASSET_STORAGE = useStorage('asset')

export default defineEventHandler(async (event) => {
  const items = event.context.params?._?.split('/') || []

  if (items.length > 2 || items.length === 0) {
    throw createError({ statusCode: 404 })
  }

  const storage: Option<{
    url: string,
    expiry: number
  }> = await ASSET_STORAGE.getItem(items.join('/_/'))

  if (storage && storage.expiry > Date.now()) {
    return await sendRedirect(event, storage.url)
  }

  const req = await fetch(`https://www.last.fm/music/${items.join('/_/')}`)
  if (!req.ok) {
    throw createError({ statusCode: req.status })
  }

  const $ = cheerio(
    await req.text()
  )

  let src
  if (items.length > 1) {
    src = $('span[class="cover-art"] > img')
      ?.attr('src')
  } else {
    src = $('ul[class="sidebar-image-list"] > li > a > img')
      ?.attr('src')
      ?.replace('avatar170s', 'avatar300s')
  }

  src = src || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'

  await ASSET_STORAGE.setItem(items.join('/_/'), {
    url: src,
    expiry: Date.now() + random(15, 60) * 60 * 1000
  })

  await sendRedirect(event, src)
})
