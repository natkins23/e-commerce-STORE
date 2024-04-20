import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'

export async function POST(req: Request, { params: { storeId } }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, billboardId } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }
    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
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
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: storeId,
      },
    })

    return NextResponse.json(category)
  } catch (e) {
    console.log('[CATEGORIES_POST]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(req: Request, { params: { storeId } }: { params: { storeId: string } }) {
  try {
    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }
    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId,
      },
    })
    return NextResponse.json(categories)
  } catch (e) {
    console.log('[CATEGORIES_GET]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}
