import venom from "venom-bot";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_KEY = "Bearer " + process.env.OPENAI_KEY;
const MODEL_ID = process.env.MODEL_ID;

venom
  .create({
    session: "zap-gpt",
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.isGroupMsg === false && message.from !== "status@broadcast") {
      if (message.content.toLowerCase().includes("about-zapgpt")) {
        client
          .sendText(
            message.from,
            `O ZapGPT é um projeto que tem como objetivo facilitar o uso da ferramenta de inteligência artificial da OpenAI, o ChatGPT, integrando-o com o WhatsApp e fazendo conversão de áudio e imagem.\n\nDesenvolvimento:\n*Júlio Cezar dos Reis Pais*\nLinkedIn: https://www.linkedin.com/in/j%C3%BAlio-reis-67a36722b/`
          )
          .then((result) => {})
          .catch((error) => {
            console.error("Error when sending: ", error);
          });
        return;
      }

      const params = {
        prompt: message || "Olá!",
        temperature: 0.5,
        max_tokens: 50,
        model: MODEL_ID,
      };

      console.log("EXECUTANDO GPT");
      console.log(`params: ${params}`, `key: ${process.env.OPENAI_KEY}`)

      axios
        .post("https://api.openai.com/v1/completions", params, {
          headers: {
            "Content-Type": "application/json",
            Authorization: OPENAI_KEY,
          },
        })
        .then((response) => {
          let text = response.data.choices[0].text;
          client
            .sendText(message.from, text)
            .then((result) => {})
            .catch((error) => {
              console.error("Error when sending: ", error);
              return;
            });
        })
        .catch((error) => {
          console.error(error);
        });

      //   client
      //     .sendText(
      //       message.from,
      //       `${message.notifyName}, sou um algoritmo, Júlio está trabalhando em mim nesse exato momento. Mande mensagem outra hora, obrigado!`
      //     )
      //     .then((result) => {})
      //     .catch((error) => {
      //       console.error("Error when sending: ", error);
      //     });
    }
  });
}
