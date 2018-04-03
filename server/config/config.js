var env = process.env.NODE_ENV || 'development';
console.log("Whats nev now? ", env);
if(env === 'development'){
  process.env.PORT = 3785;
  process.env.MONGODB_URI = "mongodb://localhost:27017/Todos";
}else if(env === 'test'){
  process.env.PORT = 3785;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodosTest";
}