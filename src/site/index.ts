import express, { Express, Request, RequestHandler, Response } from "express";


const website: Express = express();


website.get('/', (req, res) => {

  res.send("h")
})


export async function start() {

  website.listen(process.env.WEBSITE_PORT || 8080, () => {

  })

}