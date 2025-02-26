require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do CORS
const corsOptions = {
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Função para enviar e-mail
const enviarEmail = async (dados) => {
  const { nome = 'Usuário', mensagem = '', email = 'desconhecido@dominio.com' } = dados;

  if (!mensagem || !email) {
    throw new Error('Email e mensagem são obrigatórios.');
  }
  // Corpo do email
  const corpoEmail = `
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #3C77EA;">Olá ${nome},</h2>
        <p>Obrigado por sua mensagem! Retornarei o contato o mais rápido possível.</p>
        <p><strong>Sua mensagem:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #3C77EA;">
            ${mensagem}
        </blockquote>
        <p>Atenciosamente,<br>Equipe de Suporte</p>
    </body>
    </html>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Email aqui', // seu email
      pass: 'Senha aqui', // sua senha no APP do google
    },
  });

  const mailOptions = {
    from: 'Email aqui',
    to: email,
    subject: 'Obrigado por entrar em contato!',
    html: corpoEmail,
  };

  await transporter.sendMail(mailOptions);
  return { message: 'Email enviado com sucesso!' };
};

// Rota para envio de e-mail
app.post('/enviar-email', async (req, res) => {
  try {
    const { message } = await enviarEmail(req.body);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: `Erro ao enviar e-mail: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// EMAIL_USER=seu_email@gmail.com
//EMAIL_PASS=sua_senha


// Codigo para o PostMan 
//{
//	"nome": "Vinicius",
//	"email": "vynny2901@gmail.com",
//	"mensagem": "Gostaria de mais informações sobre seu serviço."
//}