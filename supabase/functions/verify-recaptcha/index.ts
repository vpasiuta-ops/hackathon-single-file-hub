import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recaptchaToken } = await req.json()

    if (!recaptchaToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'reCAPTCHA token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY')
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'reCAPTCHA service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify the reCAPTCHA token with Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', recaptchaToken)

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    const verificationResult = await verifyResponse.json()

    console.log('reCAPTCHA verification result:', verificationResult)

    if (verificationResult.success) {
      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('reCAPTCHA verification failed:', verificationResult)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'reCAPTCHA verification failed',
          details: verificationResult['error-codes'] || []
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})