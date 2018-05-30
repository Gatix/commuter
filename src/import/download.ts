import chalk from 'chalk';
import progress from 'progress';
import fs, { WriteStream } from 'fs';
import request from 'request';

const FILE_URL: string
  = 'http://transitfeeds.com/p/societe-de-transport-de-montreal/39/latest/download';
const SAVE_FOLDER: string = './files/';

const options = {
  host: 'transitfeeds.com',
  path: 'p/societe-de-transport-de-montreal/39/latest/download',
  method: 'GET', // get headers only
};

const getPercentage = (size: number, total: number): number => (size / total) * 100;

const download = () => {
  // Create if folder does not exist
  if (!fs.existsSync(SAVE_FOLDER)) {
    fs.mkdirSync(SAVE_FOLDER);
  }

  const file: WriteStream = fs.createWriteStream(SAVE_FOLDER + 'gtfs.zip');
  let bar: progress = new progress('Initializing Download', 20);
  console.log(chalk.green(' Initializing Download'));

  // Start download request
  request.get(FILE_URL)
    .on('response' , (res: request.Request) => {
      const downloadSize: number = parseInt(res.headers['content-length'], 10);
      bar = new progress('Downloading [:bar] :rate/bps :percent :eta', {
        width: 20,
        total: downloadSize,
        clear: true,
      });
      file.on('finish', file.close);
    })
    .on('data', (chunk: Buffer) => {
      file.write(chunk);
      bar.tick(chunk.length);
    })
    .on('finish', () => {
      console.log(chalk.green('Finished downloading'));
    })
    .on('error', (e) => {
      file.close();
      console.log(chalk.red('Error downloading', e.message));
    });
};

download();
