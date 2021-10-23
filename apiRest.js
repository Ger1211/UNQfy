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
        res.json({ errorMessage : `There is no Artist with ID ${artistId}`,
                 statusCode: res.statusCode});
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
        res.json({ errorMessage : error.message,
                 statusCode: res.statusCode});
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
        res.json({ errorMessage : `There is no Artist with ID ${artistId}`,
                 statusCode: res.statusCode});
    }
}).delete('/artists/:artistId',function(req,res){ //Metodo Delete no devuelve respuesta cuando es exitoso.    
    
    const artistId = req.params.artistId;
    const artist = unqfy.getArtistById(artistId);
    if (artist !== undefined){
        try{
            unqfy.deleteArtist(artist.name)
            res.status(204);
        } catch (error){
            res.status(404);
            res.json({ errorMessage : error.message,
                     statusCode: res.statusCode});
            }
    }
    else{
        res.status(404);
        res.json({ errorMessage : `There is no Artist with ID ${artistId}`,
                 statusCode: res.statusCode});
    }

}).delete('/albums/:albumId',function(req,res){  //NO FUNCIONA, EN REALIDAD EL deleteAlbum es el que no anda.
    
    const albumId = req.params.albumId;
    const album = unqfy.getAlbumById(albumId);
    if (album !== undefined){
        try{
            unqfy.deleteAlbum(album.name)
            res.status(204);
        } catch (error){
            res.status(404);
            res.json({ errorMessage : error.message,
                     statusCode: res.statusCode});
          }
    }
    else{
        res.status(404);
        res.json({ errorMessage : `There is no Album with ID ${albumId}`,
                 statusCode: res.statusCode});
    }

}).get('/artists',function(req,res){                  
    
    const artistName = req.query.name;
    result = unqfy.artistMatchWith(artistName);
    if (result.length !== 0){
        res.status(200);
        res.json(result);
    }else{
        res.status(404);
        res.json({ errorMessage : `There is no result for the artist with the name ${artistName}`,
                 statusCode: res.statusCode});
}
}).get('/albums',function(req,res){            //falta arreglar que nos discrimine entre mayuscula-miniscula          
    
    const albumName = req.query.name;
    result = unqfy.albumMatchWith(albumName);
    if (result.length !== 0){
        res.status(200);
        res.json(result);
    }else{
        res.status(404);
        res.json({ errorMessage : `There is no result for the album with the name ${albumName}`,
                 statusCode: res.statusCode});
}
}).get('/albums/:albumId',function(req,res){                    
    
    const albumId = req.params.albumId;
    const album = unqfy.getAlbumById(albumId);
    if (album !== undefined){
        res.status(200);
        res.json(album);
    }else{
        res.status(404);
        res.json({ errorMessage : `There is no Album with ID ${albumId}`,
                 statusCode: res.statusCode});
}
}).post('/album',function (req, res) {
    try{
       const albumData = {
                name: req.body.name,
                year:req.body.year};
        const artistId = req.body.artistId;
       newAlbum = unqfy.addAlbum(artistId,albumData); 
       res.status(201);      
       res.json(newAlbum);
    } catch (error){
        res.status(409);
        res.json({ errorMessage : error.message,
                 statusCode: res.statusCode});
    }
}).patch('/albums/:albumId',function (req, res){
    const albumId = req.params.albumId;
    const album = unqfy.getAlbumById(albumId);
    if (album !== undefined){
        const newYear = req.body.year
        const modifiedAlbum = unqfy.modifyAlbumById(albumId,newYear)                    
        res.status(200);
        res.json(modifiedAlbum);
    }else{
        res.status(404);
        res.json({ errorMessage : `There is no Album with ID ${albumId}`,
                 statusCode: res.statusCode});
    }
})



app.use('/api', router);
app.listen(port,
            () => console.log(`Port ${port} listening`)
);