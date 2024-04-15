import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params: { storeId } }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { label, imageUrl } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }
    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unathorized', { status: 403 })
    }

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: storeId,
      },
    })

    return NextResponse.json(billboard)
  } catch (e) {
    console.log('[BILLBOARDS_POST]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params: { storeId } }: { params: { storeId: string } }) {
  try {
    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
      },
    })
    return NextResponse.json(billboards)
  } catch (e) {
    console.log('[BILLBOARDS_GET]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}
