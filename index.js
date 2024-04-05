import express from 'express';
import fs from "fs"
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return { movies: [] }; // Si no hay datos, devolver un objeto vacío con la propiedad 'movies'
    }
};

const writeData = (data) => { // Pasar 'data' como argumento
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("malo h 2cb!");
});

app.get("/movies", (req, res) => {
    const data = readData();
    res.json(data.movies);
});

app.get("/movies/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const movie = data.movies.find((movie) => movie.id === id); // Cambié 'movies' a 'movie' para evitar confusión
    res.json(movie);
});

app.post("/movies", (req, res) => {
    const data = readData();
    const body = req.body;
    const newMovie = {
        id: data.movies.length + 1, // Corregí 'lenght' a 'length'
        ...body,
    };
    data.movies.push(newMovie);
    writeData(data); // Pasar 'data' como argumento
    res.json(newMovie);
});

app.put("/movies/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const movieIndex = data.movies.findIndex((movie) => movie.id === id);
    data.movies[movieIndex] ={
      ...data.movies[movieIndex],
      ...body,
    };
    writeData(data);
    res.json({message: "book updated successfully"})
});

app.delete("/movies/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const movieIndex = data.movies.findIndex((movie) => movie.id === id);
    data.movies.splice(movieIndex, 1);
    writeData(data);
    res.json({message: "movie deleted successfully"});
});

app.listen(3000, () => {
    console.log('server listening on port 3000');
});
