exports.putMessagesReq = async (req, res) => {
    let image_url = '';

    if (req.file !== undefined) {
        image_url = "http://localhost:3000/chatImg/" + req.file.filename;
        
        const newData = {
            imageURL: image_url,            
        }
        res.send(newData);
    }


}
