const fs = require("fs"); // necesitado para guardar/cargar unqfy
const unqmod = require("./unqfy"); // importamos el modulo unqfy

function getUNQfy(filename = "data.json") {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy
}

let unqfy = getUNQfy();
let express = require ('express');
let app = express();
let router = express.Router();
let port = process.env.PORT || 8080;


// let bodyParser= require ('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.json());



router.get('/',function(req,res){
    res.status(200);
	res.json({ message: 'hooray! welcome to our API'});
}).get('/artists/:artistId',function(req,res){
    
    const artistId = req.params.artistId;
    const artista = unqfy.getArtistById(artistId);
    if (artista !== undefined){
        res.status(200);
        res.json(artista);
    }else{
        res.status(404);
        res.json({ errorMessage : `There is no Artist with ID ${artistId}`});
}
}).post('/artist',function (req, res) {
    try{
       const artistData = {name: req.body.name,
                           country:req.body.country};
       newArtist = unqfy.addArtist(artistData); 
       res.status(201);      
       res.json(newArtist);
    } catch (error){
        res.status(409);
        res.json({ errorMessage : error.message});
    }
   });



app.use('/api', router);
app.listen(port,
            () => console.log(`Puerto ${port} escuchando`)
);
