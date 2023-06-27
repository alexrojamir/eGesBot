const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const axios = require("axios");
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


const messageContent = "Como crear un resumen diario";

const config = {
    headers: {
      "x-api-key": "sec_MMxSBfNKlzksBY2tNSLSed7pRet0ZLod",
      "Content-Type": "application/json",
    },
  };

const data = {
    sourceId: "src_USzn0mMML5jVfYXh9kA1m",
    messages: [
      {
        role: "user",
        content: messageContent,
      },
    ],
  };  

  const sendMessage = async () => {
    axios
      .post("https://api.chatpdf.com/v1/chats/message", data, config)
      .then((response) => {
        console.log(response.data.content);
        return response.data.content;
      })
      .catch((error) => {
        console.error("Error:", error.message);
        return error.response.data
      });
  };

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['eGesBot','egesbot'])
    .addAnswer(['¡Hola! soy *eGesBot🤖*','Un asistente de información de una sola interacción por mensaje, me encuentro en fase BETA por lo que mis conocimientos sobre TCI aún no son muy amplios.'])
    .addAnswer('Dime, ¿Cuál es tu consulta?', {capture:true}, async (ctx, {flowDynamic}) =>{
        const config = {
            headers: {
              "x-api-key": "sec_MMxSBfNKlzksBY2tNSLSed7pRet0ZLod",
              "Content-Type": "application/json",
            },
          };
        
        const data = {
            sourceId: "src_Ue20IzErnggIHsDrQbM4v",
            messages: [
              {
                role: "user",
                content: ctx.body,
              },
            ],
          };  
        axios
          .post("https://api.chatpdf.com/v1/chats/message", data, config)
          .then((response) => {
            flowDynamic(response.data.content)
            console.log("Result:", response.data.content);
          })
          .catch((error) => {
            console.error("Error:", error.message);
            console.log("Response:", error.response.data);
          });
        
    })
    .addAnswer('_Realizando la consulta, un momento por favor..._')


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
