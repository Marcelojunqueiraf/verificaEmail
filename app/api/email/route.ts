import nodeMailer from "nodemailer";

const html = "<h1>Test</h1>";

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  // const { email, subject, message } = await request.json();

  const info = await transporter
    .sendMail({
      from: process.env.EMAIL_USER,
      to: "marcelojunqueiraf@gmail.com",
      subject: "Subject",
      text: "Text",
      html,
    })
    .catch((error) => {
      console.log("error", error);
    });

  if (!info) {
    return new Response("Error", { status: 500 });
  }

  console.log("Message sent: %s", info);

  return new Response(JSON.stringify(info));
}
