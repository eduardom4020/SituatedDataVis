import fs from 'fs';
import path from 'path';
import http from 'http';
import settings from '../../../situated-toolkit/settings';
import RED from 'node-red';
import express from 'express';

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

const readDataset = async () => {
    const rawFileBytes = await new Promise(res => {
        fs.readFile(path.join(__dirname, './data/phoneDataset.csv'), (_, data) => res(data))
    });

    const csv = rawFileBytes.toString('utf8');
    const [headersRow, ...dataRows] = csv.split('\r\n');

    const headers = headersRow.split(',');
    const rows = dataRows.map(row => row.split(','));

    let dataset = rows.filter(row => row[0] && row[0].trim() != '')
        .map(row => (
            row.map((cell, index) => ({[headers[index]]: cell}))
                .reduce((acc, curr) => ({...acc, ...curr}), {})
        ));
    
    dataset = dataset.map(row => ({
        ...row,
        model: row.model.match(/(?=^([a-z]|[A-Z]|[0-9])+)?( .*)$/g).pop().trim(),
        brand: row.model.match(/^([a-z]|[A-Z]|[0-9])+ /g).pop().trim(),
    }));

    return dataset;
};

const readEncoding = async (fileName) => {
    const rawFileBytes = await new Promise(res => {
        fs.readFile(path.join(__dirname, `./encoding/${fileName}`), (_, data) => res(data))
    });

    return JSON.parse(rawFileBytes.toString('utf8'));
}

const router = express.Router();
router.use("/",express.static("public"));

// Define middleware for all routes
router.use((request, _, next) => {
  console.log(request.path)
  next()
});

router.get('/phoneBrands/data', async (_, res) => {
    const dataset = await readDataset();
    res.writeHead(200);
    res.end(JSON.stringify(dataset, null, 4));
});

router.get(/\/phoneBrands|\/fnac'/, async (_, res) => {
    const phoneBrandsEncoding = await readEncoding('phoneBrandsScatterplot.json');
    res.writeHead(200);
    res.end(JSON.stringify(phoneBrandsEncoding, null, 4));
});

router.get('/fnac/data', async (_, res) => {
    const fnacPhones = require('./data/fnacPhonesAllTreated.json');
    res.writeHead(200);
    res.end(JSON.stringify(fnacPhones, null, 4));
});

const app = express();
app.use(router);

const server = http.createServer(app);

RED.init(server,settings);

// // Serve the editor UI from /red
router.use(settings.httpAdminRoot, RED.httpAdmin);

// // Serve the http nodes UI from /api
router.use(settings.httpNodeRoot, RED.httpNode);

router.get(/.*/, (_, res) => {
    res.writeHead(404);
    res.end(JSON.stringify({message: "Page doesn't exist."}, null, 4));
});

server.listen(
    port,
    host,
    () => console.log(`Server listening on http://${host}:${port}.`));

RED.start();
