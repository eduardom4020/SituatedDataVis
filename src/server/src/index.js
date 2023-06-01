import fs from 'fs';
import path from 'path';
import http from 'http';

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

const requestListener = async (req, res) => {
    console.log('req url ', req.url)
    if(req.url === '/phoneBrands/data') {
        const dataset = await readDataset();
        res.writeHead(200);
        return res.end(JSON.stringify(dataset, null, 4));
    }
    
    if(req.url === '/phoneBrands' || req.url === '/fnac') {
        const phoneBrandsEncoding = await readEncoding('phoneBrandsScatterplot.json');
        res.writeHead(200);
        return res.end(JSON.stringify(phoneBrandsEncoding, null, 4));
    }

    if(req.url === '/fnac/data') {
        const fnacPhones = require('./data/fnacPhonesAllTreated.json');
        res.writeHead(200);
        return res.end(JSON.stringify(fnacPhones, null, 4));
    }

    if(req.url === '/baruk') {
        return fs.readFile(__dirname + '/baruk/baruk.html',function (_, data) {
            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
            res.write(data);
            res.end();
        });
    }

    if(req.url === '/Baruk.gif') {
        return fs.readFile(__dirname + '/baruk/Baruk.gif',function (_, data) {
            res.writeHead(200, {'Content-Type': 'application/octet-stream','Content-Length':data.length});
            res.write(data);
            res.end();
        });
    }

    res.writeHead(404);
    res.end(JSON.stringify({message: "Page doesn't exist."}, null, 4))
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
