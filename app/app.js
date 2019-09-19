const express = require('express');
const app = express();
const port = 3000;
var appRouter = require('./router');

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use('/api', appRouter);

function errorHandler(err, req, res, next) {
    res.status(500);
    res.json({error: err});
}

app.use(errorHandler);
app.get('/', (req,res) => {
    res.send("Hello World!");
})
app.post('/', (req, res)=> {
    res.send(req.body);
})
app.listen(port, () => {
    console.log('Server started'+ port);
})