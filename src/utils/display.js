// const figlet = require('figlet');
// const gradient = require('gradient-string');
// const chalk = require('chalk');
// const boxen = require('boxen');
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';
import boxen from 'boxen';


function showTitle() {
    return new Promise((resolve) => {
        figlet('Auto Tagger', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
        }, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                resolve();
                return;
            }
            console.log(gradient.pastel.multiline(data));
            console.log(boxen(chalk.blue('Git Tag 版本管理工具 by adi'), {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'blue'
            }));
            resolve();
        });
    });
}

function showError(error) {
    console.log(boxen(
        `${chalk.red('錯誤:')} ${error.message}\n\n` +
        `${chalk.gray('詳細錯誤:')}\n${error.stack}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'red'
        }
    ));
}

function showVersionComparison(currentTag, newTag) {
    console.log(boxen(
        `${chalk.blue('當前版本:')} ${chalk.yellow(currentTag)}\n` +
        `${chalk.blue('新版本:')} ${chalk.green(newTag)}`,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan'
        }
    ));
}

// module.exports = {
//     showTitle,
//     showError,
//     showVersionComparison
// }; 

export {
    showTitle,
    showError,
    showVersionComparison
}