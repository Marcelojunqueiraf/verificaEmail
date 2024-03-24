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
  const { email, code } = await request.json();

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const range = "codigos!A:B";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: range,
  });

  if (response.status !== 200) {
    return new Response("Error", { status: 500 });
  }

  if (!response.data.values) {
    return new Response("Error", { status: 500 });
  }

  const data = response.data.values;

  const index = data.findIndex((row) => row[0] === email && row[1] === code);

  if (index === -1) {
    return new Response("Error", { status: 500 });
  }

  //write the email as verified on the verificados sheet
  const range2 = "verificados!A:A";

  const response2 = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: range2,
    valueInputOption: "RAW",
    requestBody: {
      values: [[email]],
    },
  });

  if (response2.status !== 200) {
    return new Response("Error", { status: 500 });
  }

  const html = `
    <h1>Email verificado!</h1>
    <p>Seu email foi verificado com sucesso! </p>
    <p>Nos próximos dias estaremos verificando seu atestado de matrícula e então você estará pronto para utilizar o UnB Caronas!</p>
    `;

  const info = await transporter
    .sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email verificado - UnB Caronas",
      html,
    })
    .catch((error) => {
      console.log("error", error);
      return new Response("Email not sent", { status: 500 });
    });

  return new Response(null, { status: 200 });
}
