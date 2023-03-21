import fs from 'fs';
import path from 'path';
import http from 'http';

const host = '0.0.0.0';
const port = 8000;

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

const requestListener = async (req, res) => {
    const dataset = await readDataset();
    res.writeHead(200);
    res.end(JSON.stringify(dataset, null, 4));
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
