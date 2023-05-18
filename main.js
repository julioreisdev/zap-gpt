import venom from "venom-bot";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const OPENAI_KEY = "Bearer " + process.env.OPENAI_KEY;

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
        model: "gpt-3.5-turbo-0301",
        messages: [
          {
            role: "user",
            content: message.content || "",
          },
        ],
      };

      console.log("EXECUTANDO GPT");

      axios
        .post("https://api.openai.com/v1/completions", params, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${OPENAI_KEY}`,
          },
        })
        .then((response) => {
          client
            .sendText(
              message.from,
              `*ZapGPT*\n\n${response.data.choices[0].message.content}` ||
                "response"
            )
            .then((result) => {})
            .catch((error) => {
              console.error("Error when sending: ", error);
              return;
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
}
