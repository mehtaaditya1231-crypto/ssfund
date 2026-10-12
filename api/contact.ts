import type { IncomingMessage, ServerResponse } from "node:http";

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  preferredMethod?: string;
  consent?: boolean;
  website_url?: string; // honeypot
}

// In-memory rate limiting map for basic spam protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  // Allow local development and testing
  if (ip === "127.0.0.1" || ip === "::1" || ip === "unknown" || ip === "localhost") {
    return false;
  }

  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 6;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= maxRequests) {
    return true;
  }

  current.count += 1;
  return false;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: any, res: any) {
  // Accept only POST requests
  if (req.method !== "POST") {
    if (res.setHeader) {
      res.setHeader("Allow", ["POST"]);
    }
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Only POST requests are accepted.",
    });
  }

  try {
    const ip =
      (req.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    if (isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        error: "Too many enquiries submitted from this network. Please try again later.",
      });
    }

    let body: ContactRequestBody = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          error: "Malformed request payload.",
        });
      }
    } else if (!body && req.on) {
      // Parse request stream if body was not pre-parsed
      body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk: any) => {
          data += chunk;
        });
        req.on("end", () => {
          try {
            resolve(data ? JSON.parse(data) : {});
          } catch (err) {
            resolve({});
          }
        });
        req.on("error", reject);
      });
    }

    // Honeypot check: reject bots silently
    if (body.website_url) {
      return res.status(200).json({
        success: true,
        message: "Enquiry received successfully.",
      });
    }

    const rawName = body.name?.trim() || "";
    const rawEmail = body.email?.trim() || "";
    const rawPhone = body.phone?.trim() || "";
    const rawLocation = body.location?.trim() || "";
    const rawMessage = body.message?.trim() || "";
    const preferredMethod = body.preferredMethod?.trim() || "";
    const consent = body.consent === true;

    if (!rawName) {
      return res.status(400).json({
        success: false,
        error: "Full name is required.",
      });
    }

    if (!rawEmail || !isValidEmail(rawEmail)) {
      return res.status(400).json({
        success: false,
        error: "A valid email address is required.",
      });
    }

    if (!rawMessage) {
      return res.status(400).json({
        success: false,
        error: "Please share what you would like to discuss.",
      });
    }

    const validMethods = ["Email", "Phone", "Either"];
    if (!validMethods.includes(preferredMethod)) {
      return res.status(400).json({
        success: false,
        error: "Please select a preferred contact method (Email, Phone, or Either).",
      });
    }

    if (!consent) {
      return res.status(400).json({
        success: false,
        error: "Consent is required to submit your enquiry.",
      });
    }

    const sanitizedData = {
      name: sanitize(rawName).slice(0, 100),
      email: sanitize(rawEmail).slice(0, 120),
      phone: sanitize(rawPhone).slice(0, 30),
      location: sanitize(rawLocation).slice(0, 100),
      message: sanitize(rawMessage).slice(0, 3000),
      preferredMethod,
      submittedAt: new Date().toISOString(),
    };

    const targetEmail = process.env.NOTIFICATION_EMAIL || "info@ssvalueplus.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || "SS Value Plus Fund <noreply@ssvalueplus.com>",
            to: targetEmail,
            subject: `New Enquiry from ${sanitizedData.name} — SS Value Plus Fund`,
            text: [
              `New enquiry submitted on ${sanitizedData.submittedAt}`,
              `Full Name: ${sanitizedData.name}`,
              `Email: ${sanitizedData.email}`,
              `Phone: ${sanitizedData.phone || "Not provided"}`,
              `City / Country: ${sanitizedData.location || "Not provided"}`,
              `Preferred Method: ${sanitizedData.preferredMethod}`,
              ``,
              `Enquiry Message:`,
              sanitizedData.message,
            ].join("\n"),
          }),
        });
      } catch {
        // Secure logging: never log personal details in production logs
        console.error("External email provider dispatch failed.");
      }
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry received successfully.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while processing your request. Please try again later.",
    });
  }
}
