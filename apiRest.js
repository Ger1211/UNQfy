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
app.use(express.json());

//CONSULTAR: DSP DE CADA METODO, APLICAR UNQ.SAVE() ??

router.get('/',function(req,res){
    res.status(200);
	res.json({ message: 'hooray! welcome to our API'});
}).get('/artists/:artistId',function(req,res){                       //router.route('/artists/:artistId').get(function (req, res){
    
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
}).patch('/artists/:artistId',function (req, res){
    const artistId = req.params.artistId;
    const artista = unqfy.getArtistById(artistId);
    if (artista !== undefined){
        const newArtistData = {name: req.body.name,
                               country:req.body.country};
        const modifiedArtist = unqfy.modifyArtistById(artistId,newArtistData)                    
        res.status(200);
        res.json(modifiedArtist);
    }else{
        res.status(404);
        res.json({ errorMessage : `There is no Artist with ID ${artistId}`});
    }
}).delete('/artists/:artistId',function(req,res){                    
    
    const artistId = req.params.artistId;
    const artista = unqfy.getArtistById(artistId);
    if (artista !== undefined){
        try{
            unqfy.deleteArtistById(artistId)
           // unqfy.save("data.json");
            res.status(204);
            res.json({ status : `The artist with ID ${artistId} was successfully eliminated`});
        } catch (error){
            res.status(404);
            res.json({ errorMessage : error.message});
        }
    }
    else{
        res.status(404);
        res.json({ errorMessage : `There is no Artist with ID ${artistId}`});
    }

});



app.use('/api', router);
app.listen(port,
            () => console.log(`Puerto ${port} escuchando`)
);