import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "non" }, { status: 402 });
    }

    const body = await req.json(); // Parse the JSON body
    const { unlockDate, icloudEmail, icloudPassword, generatedCode } = body;

    // Validate required fields
    if (!unlockDate || !icloudEmail || !icloudPassword || !generatedCode) {
      return NextResponse.json(
        {
          error:
            "All fields are required: unlockDate, icloudEmail, icloudPassword, generatedCode.",
        },
        { status: 400 }
      );
    }

    // Validate generatedCode is a number
    const parsedCode = parseInt(generatedCode, 10);
    if (isNaN(parsedCode)) {
      return NextResponse.json(
        { error: "Generated code must be a valid number." },
        { status: 400 }
      );
    }

    // Insert into the database
    const newTimeLimit = await prisma.timeLimit.create({
      data: {
        unlockDate: new Date(unlockDate), // Ensure the date is correctly parsed
        icloudEmail,
        icloudPassword,
        generatedCode: parsedCode,
        userId: session.user?.id ?? null, // Ensure userId is either a string or null
      },
    });

    return NextResponse.json(newTimeLimit, { status: 201 });
  } catch (error) {
    console.error("Error creating timeLimit:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
