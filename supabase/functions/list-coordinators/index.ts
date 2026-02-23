import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create Supabase client with service role key
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('MY_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Verify the caller is an admin
        const authHeader = req.headers.get('Authorization')
        console.log('Auth Header:', authHeader)

        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Missing Authorization header', debug: { headers: Object.fromEntries(req.headers.entries()) } }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const token = authHeader.replace('Bearer ', '')

        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

        console.log('User from token:', user)
        console.log('User metadata:', user?.user_metadata)
        console.log('User error:', userError)

        if (userError || !user) {
            return new Response(
                JSON.stringify({
                    error: 'Unauthorized - Could not verify user',
                    debug: {
                        userError,
                        tokenLength: token?.length
                    }
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check if user is admin
        console.log('Checking admin role:', user.user_metadata?.role)
        if (user.user_metadata?.role !== 'admin') {
            return new Response(
                JSON.stringify({
                    error: `Forbidden: Admin access required. Your role: ${user.user_metadata?.role || 'none'}`,
                    debug: {
                        user_id: user.id,
                        metadata: user.user_metadata
                    }
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // List all users using Admin API
        const { data, error } = await supabaseAdmin.auth.admin.listUsers()

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message, debug: { operation: 'listUsers' } }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Filter to only coordinators (users with team metadata, exclude admins)
        const coordinators = data.users
            .filter((user) => user.user_metadata?.team)
            .map((user) => ({
                id: user.id,
                email: user.email || '',
                team_name: user.user_metadata.team,
                created_at: user.created_at,
            }))

        return new Response(
            JSON.stringify({ coordinators }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        return new Response(
            JSON.stringify({ error: message, debug: { stack } }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
