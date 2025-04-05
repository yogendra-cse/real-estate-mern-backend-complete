export const addMessage = async(req,res) =>{
    const tokenUserId =req.userId;
    const chatId = req.params.chatId;
   try {
   res.status(200).json("");
   } catch (error) {
    console.log(error)
    res.status(500).json({message : "Failed to add message!"});
   }
}