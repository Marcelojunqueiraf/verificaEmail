import { google } from "googleapis";
import nodeMailer from "nodemailer";

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
  const { email } = await request.json();
  // todo: verify if email is registered

  // scope for editing the spreadsheet
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });

  const sheets = google.sheets({ version: "v4", auth });

  const code = Math.floor(100000 + Math.random() * 900000);

  // append on the last row of the sheet the email and a verification code

  const range = "codigos!A:B";
  const response = await sheets.spreadsheets.values
    .append({
      spreadsheetId: process.env.SHEET_ID,
      range: range,
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, code]],
      },
    })
    .catch((error) => {
      console.log("error", error);
      return new Response("Não foi possível editar a planilha", {
        status: 500,
      });
    });

  // send email
  const html = `
    <h1>Verificação de email institucional - UnB Caronas</h1>
    <p>Olá, tudo bem?</p>
    <p>Para confirmar seu email institucional, clique no link abaixo:</p>
    <a href="${process.env.FRONT_URL}/verify?email=${email}&code=${code}">Clique aqui</a>
    <p>Se você não solicitou essa verificação, por favor ignore este email.</p>
    <p>Atenciosamente, UnB Caronas</p>
    `;

  const info = await transporter
    .sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verificação de email institucional - UnB Caronas",
      html,
    })
    .catch((error) => {
      console.log("error", error);
      return new Response("Email not sent", { status: 500 });
    });

  return new Response(null, { status: 200 });
}
