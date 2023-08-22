import * as cheerio from 'cheerio'
import { type ClassValue, clsx } from 'clsx'
import type { SanityDocument } from 'next-sanity'
import { twMerge } from 'tailwind-merge'
import type { Bookmark } from '~/schemas/bookmark'
import type { SiteInfo } from '~/types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getSiteInfo = async (url: string): Promise<SiteInfo> => {
  const headers: HeadersInit = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  }
  try {
    const data = await (await fetch(url, {
      headers,
      method: 'GET',
    })).text()

    const $ = cheerio.load(data)
    const cover = $('meta[property="og:image"]').attr('content') ?? null
    const title = $('title').text() ?? null
    const description = $('meta[property="og:description"]').attr('content') ?? null

    return {
      cover,
      title,
      description,
    }
  } catch {
    return {
      cover: null,
      title: null,
      description: null,
    }
  }
}

export const formatBookmark = (bookmark: SanityDocument<Omit<Bookmark, 'updatedAt' | 'createdAt' | 'id'>>) => ({
  id: bookmark._id,
  title: bookmark.title,
  url: bookmark.url,
  cover: bookmark.cover,
  description: bookmark.description,
  createdAt: bookmark._createdAt,
  updatedAt: bookmark._updatedAt,
})
