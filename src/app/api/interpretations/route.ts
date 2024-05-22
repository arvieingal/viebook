import { NextResponse } from "next/server";
import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";

const database = new Databases(client);

//create Post
async function createInterpretation(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.log("Error creating interpratations", error);
    throw new Error("Failed to create interpretations");
  }
}

//fetch post
async function fetchInterpretations() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.log("Error fetching interpratations", error);
    throw new Error("Failed to fetch interpretations");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await createInterpretation(data);
    return NextResponse.json({ message: "Interpretation created" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create interpretation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpretations = await fetchInterpretations();
    return NextResponse.json(interpretations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}
