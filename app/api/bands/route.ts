import { NextRequest, NextResponse } from 'next/server'

const DEVICE_API_BASE_URL = "http://20.62.13.44:4041/iot/devices"

export async function GET() {
  try {
    const response = await fetch(DEVICE_API_BASE_URL, {
      method: 'GET',
      headers: {
        'fiware-service': 'smart',
        'fiware-servicepath': '/',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar dispositivos: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Filtra apenas as pulseiras válidas (exclui a 001 que é de teste)
    const validDevices = data.devices.filter((device: any) => 
      device.entity_name !== 'urn:ngsi-ld:Band:001' && 
      device.entity_type === 'Band'
    )
    
    const responseData = {
      count: validDevices.length,
      devices: validDevices
    }

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Erro ao buscar dispositivos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}