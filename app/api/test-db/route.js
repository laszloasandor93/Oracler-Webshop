import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabase-server.js'

export async function GET(request) {
  try {
    // Check if Supabase is configured
    if (!supabaseServer) {
      return NextResponse.json(
        {
          connected: false,
          error: 'Supabase not configured',
          message: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables',
        },
        { status: 200 }
      )
    }

    // Test connection by querying the orders table
    const { data, error, count } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (error) {
      // Check if it's a table not found error
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          {
            connected: true,
            tableExists: false,
            error: 'Orders table does not exist',
            message: 'Please run the SQL script from supabase-schema.sql in your Supabase SQL Editor',
            errorDetails: error.message,
          },
          { status: 200 }
        )
      }

      return NextResponse.json(
        {
          connected: true,
          tableExists: true,
          error: 'Database query error',
          errorDetails: error.message,
          errorCode: error.code,
        },
        { status: 200 }
      )
    }

    // Success - connection works and table exists
    return NextResponse.json(
      {
        connected: true,
        tableExists: true,
        message: 'Successfully connected to Supabase database',
        orderCount: count || 0,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error testing database connection:', error)
    return NextResponse.json(
      {
        connected: false,
        error: 'Connection test failed',
        errorDetails: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

