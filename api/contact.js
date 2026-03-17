export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, msg } = req.body;
  if (!name || !email || !msg) return res.status(400).json({ error: "Missing fields" });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "dheerajyampati@gmail.com",
        subject: `📬 Portfolio message from ${name}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #f5f5f7; border-radius: 16px;">
            <h2 style="color: #1d1d1f; margin-bottom: 24px;">New message from your portfolio</h2>
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <p style="font-size: 13px; color: #6e6e73; margin-bottom: 4px;">FROM</p>
              <p style="font-size: 15px; color: #1d1d1f; font-weight: 600;">${name}</p>
              <p style="font-size: 14px; color: #0071e3;">${email}</p>
            </div>
            <div style="background: white; border-radius: 12px; padding: 20px;">
              <p style="font-size: 13px; color: #6e6e73; margin-bottom: 8px;">MESSAGE</p>
              <p style="font-size: 15px; color: #1d1d1f; line-height: 1.6;">${msg.replace(/\n/g, "<br/>")}</p>
            </div>
            <p style="font-size: 12px; color: #6e6e73; margin-top: 24px; text-align: center;">Sent from your Portfolio OS contact form</p>
          </div>
        `,
      }),
    });

    if (response.ok) return res.status(200).json({ success: true });
    const err = await response.json();
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  } catch (error) {
    console.error("Contact handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
