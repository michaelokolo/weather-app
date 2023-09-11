import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express()
const port = 3000
const API_URL = "http://api.openweathermap.org/"
const APIKey = "266c147c608b3570f0d5b710e8c0ddea"


app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.post("/submit", async (req,res)=>{

try {
    const geolocation_result = await axios.get(
        API_URL + "geo/1.0/direct",
        {
            params:{
                q:req.body.city,
                appid:APIKey
            }
        } 
        )
        const lat = geolocation_result.data[0]['lat']
        const lon = geolocation_result.data[0]['lon']
    
    const result = await axios.get(
        API_URL + "data/2.5/weather",
        {
            params:{
                lat:lat,
                lon:lon,
                appid:APIKey
            }
        }
    )
    
    res.render("index.ejs", {
        name:result.data.name, 
        description:result.data.weather[0]['description'],
        temp:Math.floor((result.data.main.temp) - 273.15),
        wind:result.data.wind.speed
    })

} catch (error) {
    res.status(404).send(error.message)
}
})

app.listen(port, ()=>{
    console.log(`Server is listening at port ${port}`)
})