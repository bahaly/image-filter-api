import express from 'express';
import {  Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  /**************************************************************************** */

  app.get('/filteredimage', async (req, res) => {    
    let url = req.query.image_url.toString();
    let image_array : string[] = []    

    if(!url){
      return res.status(400).send({message:"bad request!"});
    }
    try{
      const img = await filterImageFromURL(url)
      image_array = [img]
      await res.sendFile(img);
    } catch{
      return res.status(422).send({ message: 'Cannot read image' });
    }
    res.on("finish", () => {
      deleteLocalFiles(image_array);
    })
    
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();