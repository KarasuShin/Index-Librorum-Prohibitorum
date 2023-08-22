import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSiteInfo } from '~/lib/utils'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url || !url.match(/^https?:\/\//)) {
    return NextResponse.json({
      message: 'invalid url',
    }, {
      status: 400,
    })
  }

  return NextResponse.json(await getSiteInfo(url))
}
