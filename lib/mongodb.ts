import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try{
    if(process.env.MONGODB_URI == null) 
      return;
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to MongoDB.");
  }catch(error){
    console.log(error);
  }
};

export default connectMongoDB;