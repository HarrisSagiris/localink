#!/usr/bin/env node

const { program } = require('commander');
const QRCode = require('qrcode');
const chalk = require('chalk');
const os = require('os');

// Get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1';
};

// Program version and description
program
  .version('1.0.0')
  .description('Share your local network links with QR codes for easy mobile testing');

// Add port option
program
  .option('-p, --port <number>', 'Port number to share (default: 3000)', '3000');

// Default command
program
  .action(async (options) => {
    const port = options.port;
    const localIP = getLocalIP();
    const url = `http://${localIP}:${port}`;

    console.log(chalk.blue('\n🔗 Your localink:'), chalk.green(url));
    console.log(chalk.yellow('\nScan this QR code to access your localink:\n'));
    console.log(chalk.gray('Make sure your device is connected to the same network\n'));

    try {
      const qrString = await QRCode.toString(url, { type: 'terminal' });
      console.log(qrString);
    } catch (err) {
      console.error(chalk.red('Error generating QR code:'), err);
      process.exit(1);
    }
  });

program.parse(process.argv);
