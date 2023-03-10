import express from 'express'
import { Request, Response } from 'express';

const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
var bodyParser = require('body-parser')


require('dotenv').config()

const app = express();

app.use(cors({origin: '*'}));
app.use(bodyParser.json())


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface bodyImage{
  description: string
}

interface bodyChat{
  question: string
}

app.post('/generateimage', async function (req: Request, res: Response ) {
  try{ 
    const {description} = req.body as bodyImage; 
    const response = await openai.createImage({
      prompt: description,
      n: 1,
      size: "1024x1024",
    });
    var image_url = response.data.data[0].url;

    return  res.json({result: image_url});

  }catch(error){
      return res.status(500).json({error: 'An error occurred during your request.'})
  }
})


app.post('/chat', async function (req: Request, res: Response ) {
  try{ 
    const {question} = req.body as bodyChat; 
    const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:"A: " +  question + " \n B:",
    temperature: 0,
    max_tokens: 1000,
    });
    
    return  res.json({result: response.data.choices[0].text})

  }catch(error){
      return res.status(500).json({error: 'An error occurred during your request.'})
  }
})

app.listen(3000)



