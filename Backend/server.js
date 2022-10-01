import express from 'express'
import router from './Routing/index.js';

const app = express();
const port = 3000;
app.listen(() => {
    console.log('listening on port ' + port);
})
app.use('/testing',router);
