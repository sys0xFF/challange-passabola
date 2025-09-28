import { NextRequest, NextResponse } from 'next/server'

const BAND_API_BASE_URL = "http://20.62.13.44:1026/v2/entities"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bandId = params.id
    const entityId = `urn:ngsi-ld:Band:${bandId.padStart(3, '0')}`
    
    const headers = {
      'fiware-service': 'smart',
      'fiware-servicepath': '/',
    }
    
    // Adiciona headers de cache nos requests
    const headersWithCache = {
      ...headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }

    // Busca todos os scores (X, Y, Z) em paralelo
    const [scoreXRes, scoreYRes, scoreZRes] = await Promise.all([
      fetch(`${BAND_API_BASE_URL}/${entityId}/attrs/scoreX`, { 
        headers: headersWithCache,
        cache: 'no-store'
      }),
      fetch(`${BAND_API_BASE_URL}/${entityId}/attrs/scoreY`, { 
        headers: headersWithCache,
        cache: 'no-store'
      }),
      fetch(`${BAND_API_BASE_URL}/${entityId}/attrs/scoreZ`, { 
        headers: headersWithCache,
        cache: 'no-store'
      })
    ])
    
    const result: any = {}
    
    if (scoreXRes.ok) {
      result.scoreX = await scoreXRes.json()
    }
    
    if (scoreYRes.ok) {
      result.scoreY = await scoreYRes.json()
    }
    
    if (scoreZRes.ok) {
      result.scoreZ = await scoreZRes.json()
    }
    
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error(`Erro ao buscar scores da pulseira ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bandId = params.id
    const entityId = `urn:ngsi-ld:Band:${bandId.padStart(3, '0')}`
    const body = await request.json()
    
    const response = await fetch(`${BAND_API_BASE_URL}/${entityId}/attrs`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'fiware-service': 'smart',
        'fiware-servicepath': '/',
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao controlar evento: ${response.status}` },
        { status: response.status }
      )
    }
    
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error(`Erro ao controlar evento da pulseira ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}