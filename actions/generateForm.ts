"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

export const generateForm = async (prevState: unknown, formData: FormData) => {
  try {
    // Clerk se current user le lo
    const user = await currentUser();
    if (!user) return { success: false, message: "User not found" };

    // Form validation
    const schema = z.object({
      description: z.string().min(1, "Description is required"),
    });

    const parsed = schema.safeParse({
      description: formData.get("description") as string,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid form data",
        error: parsed.error.issues,
      };
    }

    const { description } = parsed.data;

    if (!process.env.GEMINI_API_KEY) {
      return { success: false, message: "GEMINI_API_KEY not set" };
    }

    // Gemini client init
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt
    const prompt = `Generate a JSON response for a form with the following structure. Ensure the keys and format remain constant in every response.
{
  "formTitle": "string",
  "formFields": [
    {
      "label": "string",
      "name": "string",
      "placeholder": "string"
    }
  ]
}
Requirements:
- Use only the given keys: "formTitle", "formFields", "label", "name", "placeholder".
- Always include at least 3 fields in the "formFields" array.
- Keep the field names consistent across every generation for reliable rendering.
- Provide meaningful placeholder text for each field based on its label.
${description}`;

    // Generate response
    const result = await model.generateContent(prompt);
    let formContent = result.response?.text();

    if (!formContent) {
      return { success: false, message: "Failed to generate form content" };
    }

    // Clean ```json ... ``` wrapping if present
    formContent = formContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let formJsonData;
    try {
      formJsonData = JSON.parse(formContent);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {
        success: false,
        message: "Generated form content is not valid JSON",
      };
    }

    console.log("Generated form -> ", formJsonData);

    // Save JSON to DB (stringified for safety)
    const form = await prisma.form.create({
      data: { ownerId: user.id, content: JSON.stringify(formJsonData) },
    });

    // Revalidate cache
    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: "Form generated successfully.",
      data: form,
    };
  } catch (error) {
    console.error("Error generating form:", error);
    return {
      success: false,
      message: "An error occurred while generating the form",
    };
  }
};
