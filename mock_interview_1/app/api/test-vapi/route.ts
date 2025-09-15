// app/api/test-vapi/route.ts
export async function GET() {
  const config = {
    hasWebToken: !!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN,
    hasWorkflowId: !!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
    tokenLength: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN?.length || 0,
    workflowIdLength: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID?.length || 0,
    // Show first few characters for verification (not full token for security)
    tokenPrefix: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN?.substring(0, 10) || "not set",
    workflowPrefix: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID?.substring(0, 10) || "not set"
  };
  
  return Response.json({
    success: true,
    config,
    status: {
      webToken: config.hasWebToken ? "✅ Set" : "❌ Missing",
      workflowId: config.hasWorkflowId ? "✅ Set" : "❌ Missing"
    }
  });
}