// app/api/test-firebase/route.ts
import { db } from "@/firebase/admin";

export async function GET() {
  try {
    console.log("Testing Firebase connection...");
    
    // Test 1: Check if we can read from a collection
    const testRead = await db.collection("interviews").limit(1).get();
    console.log("Read test successful, documents found:", testRead.size);
    
    // Test 2: Try to write a test document
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: "This is a test document"
    };
    
    const writeResult = await db.collection("test").add(testDoc);
    console.log("Write test successful, document ID:", writeResult.id);
    
    // Clean up test document
    await writeResult.delete();
    console.log("Cleanup successful");
    
    return Response.json({
      success: true,
      message: "Firebase connection is working",
      readTest: `Found ${testRead.size} documents`,
      writeTest: "Write and delete successful"
    });
  } catch (error) {
    console.error("Firebase test error:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 });
  }
}