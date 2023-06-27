const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const axios = require("axios");
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrincipal = addKeyword(['eGesBot','egesbot'])
    .addAnswer(['¡Hola! soy *eGesBot🤖*','Un asistente de información de una sola interacción por mensaje, me encuentro en fase BETA por lo que mis conocimientos sobre el eGestor y servicios aún no son muy amplios.'])
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
