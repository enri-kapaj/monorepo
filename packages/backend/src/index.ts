import express from 'express';
import router from './routes/router';

const app = express();



app.use('/', router);


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
