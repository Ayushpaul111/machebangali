// app/api/submit/route.js
import { google } from "googleapis";
import { NextResponse } from "next/server";

// Initialize Google Sheets client
async function getGoogleSheetsClient() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (!privateKey) {
      throw new Error("Google private key is not configured");
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error("Google client email is not configured");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
  } catch (error) {
    console.error("Error initializing Google Sheets client:", error);
    throw new Error(
      `Google Sheets client initialization failed: ${error.message}`
    );
  }
}

export async function POST(req) {
  try {
    const orderData = await req.json();

    // Validate the required fields
    if (
      !orderData.customerInfo ||
      !orderData.items ||
      orderData.total === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const { customerInfo, items, total } = orderData;

    const sheets = await getGoogleSheetsClient();

    // Format the order items with each item on a new line including weight
    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} (${item.weight || "N/A"}) x${item.quantity} - ₹${
            item.totalPrice
          }`
      )
      .join("\n");

    // Format the current date and time
    const orderDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Prepare row data - updated to match form fields
    const rowData = [
      [
        orderDate,
        customerInfo.name,
        customerInfo.phone,
        customerInfo.tableNumber, // This is actually the delivery address from form
        customerInfo.deliveryTime || "Not specified",
        itemsList,
        `₹${total}`,
        customerInfo.notes || "",
        "Pending", // Initial order status
      ],
    ];

    try {
      // Verify sheet access first
      await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
      });
    } catch (error) {
      if (error.code === 403) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Service account doesn't have access to the spreadsheet. " +
              "Please share the spreadsheet with " +
              process.env.GOOGLE_CLIENT_EMAIL,
          },
          { status: 403 }
        );
      }
      throw error;
    }

    // Add row to Google Sheet - updated range to include more columns
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Orders!A:I", // Expanded to include delivery time and notes
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rowData,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order submitted successfully",
      orderDetails: orderData,
    });
  } catch (error) {
    console.error("Error submitting order:", error);

    // Handle specific error cases
    if (error.code === 403) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Permission denied. Please check service account permissions.",
          error: error.message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
