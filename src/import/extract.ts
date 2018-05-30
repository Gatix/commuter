import chalk from 'chalk';
import child_process from 'child_process';

child_process.exec('unzip -o ./files/gtfs.zip -d ./gtfs', (err) => {
  if (err) {
    console.log(chalk.red('Error extracting file'));
  }
  console.log(chalk.green('Extracted GTFS files to ./gtfs'));
});
