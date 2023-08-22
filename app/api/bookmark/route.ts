import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { client } from '~/sanity/lib/client'
import type { Bookmark } from '~/schemas/bookmark'
import { type CreateBookmarkDto, updateBookSchema } from '~/schemas/bookmark'
import { formatBookmark, getSiteInfo } from '~/lib/utils'

const createBookmarkSchema = z.object({
  title: z.string({ invalid_type_error: 'title must be a string' }).optional(),
  url: z.string({ invalid_type_error: 'invalid url' }).url({ message: 'invalid url' }),
})

export const GET = async () => {
  const data = await client.fetch(`*[_type== "bookmark"] {
    "id": _id,
    title, 
    url, 
    cover,
    description,
    "createdAt": _createdAt, 
    "updatedAt": _updatedAt
  }`)
  return NextResponse.json(data)
}

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json()
    const { title, url } = createBookmarkSchema.parse(data)
    const siteInfo = await getSiteInfo(url)
    const bookmark = await client.create<CreateBookmarkDto>({
      _type: 'bookmark',
      title: title ?? siteInfo.title ?? url,
      url,
      cover: siteInfo.cover ?? '',
      description: siteInfo.description ?? '',
    })
    return NextResponse.json(formatBookmark(bookmark), {
      status: 201,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: error.issues[0].message,
      }, {
        status: 400,
      })
    }
    return new Response(undefined, {
      status: 500,
    })
  }
}

export const PUT = async (req: NextRequest) => {
  try {
    const data = await req.json()
    const { title, url, cover, description, id } = updateBookSchema.parse(data)
    const bookmark = await client.getDocument<Bookmark>(id)
    if (!bookmark) {
      return NextResponse.json({
        message: 'bookmark not found',
      }, {
        status: 404,
      })
    }
    bookmark.title = title
    bookmark.url = url
    bookmark.cover = cover
    bookmark.description = description
    await client.createOrReplace(bookmark)
    return NextResponse.json(formatBookmark(bookmark), {
      status: 200,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: error.issues[0].message,
      }, {
        status: 400,
      })
    }
    console.error(error)
    return new Response(undefined, {
      status: 500,
    })
  }
}

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({
      message: 'invalid id',
    }, {
      status: 400,
    })
  }

  const bookmark = await client.getDocument<Bookmark>(id)
  if (!bookmark) {
    return NextResponse.json({
      message: 'bookmark not found',
    }, {
      status: 404,
    })
  }

  await client.delete(id)

  return NextResponse.json(formatBookmark(bookmark), {
    status: 200,
  })
}
