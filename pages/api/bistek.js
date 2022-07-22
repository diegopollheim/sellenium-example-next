// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { v4: uuidv4 } = require("uuid");
const { Builder, By, Key, util } = require("selenium-webdriver");
const fs = require("fs");

export default async function handler(req, res) {
  let produtos = [];

  // Inicia o teste e abre o site informado no navegador informado
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://www.bistek.com.br/");

  // Insere a palavra cerveja e aperta ENTER
  await driver.findElement(By.id("search")).sendKeys("cerveja", Key.ENTER);

  // Capturar todos os produtos da primaira pagina
  const itens = await driver.findElements(By.css(".product-item"));

  itens.forEach(async (element) => {
    const desc = await element.findElement(By.css(".product-item-name")).getText();
    const preco = await element.findElement(By.css(".price")).getText();
    // const precoPromocional = await element.findElement(By.css(".special-price"));

    // Insere um obj na lista
    produtos.push({
      id: uuidv4(),
      nome: desc,
      preco: preco,
    });

    // Grava em um arquivo de texto
    fs.writeFile("produtos.json", JSON.stringify(produtos), function (err) {
      if (err) {
        console.log("Erro ao salvar arquivo!\n", err);
      } else {
        console.log("Arquivo salvo com sucesso!");
      }
    });    
    res.status(200).send(produtos);
  });


}
