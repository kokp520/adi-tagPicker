const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const chalk = require('chalk');
const boxen = require('boxen');
const ora = require('ora');
const figlet = require('figlet');
const gradient = require('gradient-string');

// figet title
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

async function isGitRepo() {
    const spinner = ora('檢查 Git 倉庫...').start();
    const git = simpleGit();
    try {
        await git.revparse(['--git-dir']);
        spinner.succeed('Git 倉庫檢查通過');
        return true;
    } catch (error) {
        spinner.fail('不是有效的 Git 倉庫');
        return false;
    }
}

async function getAllTags() {
    const git = simpleGit();
    const spinner = ora('正在獲取 Git tags...').start();
    try {
        const { all: tags } = await git.tags();
        if (tags.length > 0) {
            spinner.succeed(`成功獲取 ${tags.length} 個 tags`);
        } else {
            spinner.info('倉庫中沒有任何 tags');
        }
        return tags.sort((a, b) => {
            return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
        });
    } catch (error) {
        spinner.fail('獲取 tags 失敗');
        throw new Error('獲取 tags 失敗');
    }
}

function parseVersion(tag) {
    const spinner = ora(`正在解析 tag: ${tag}`).start();
    const versionMatch = tag.match(/[0-9]+\.[0-9]+\.[0-9]+/);
    if (!versionMatch) {
        spinner.warn(`Tag "${tag}" 不符合版本號格式 (x.y.z)`);
        return null;
    }
    
    const version = versionMatch[0];
    const parts = version.split('.').map(Number);
    spinner.succeed(`成功解析版本號: ${version}`);
    return parts;
}

function incrementVersion(version, type) {
    const [major, minor, patch] = version;
    switch (type) {
        case 'main':
            return [major + 1, 0, 0];
        case 'mid':
            return [major, minor + 1, 0];
        case 'fix':
            return [major, minor, patch + 1];
        default:
            return version;
    }
}

async function run() {
    try {
        await showTitle();
        
        if (!await isGitRepo()) {
            console.log(boxen(chalk.red('請在 Git 倉庫目錄下執行此命令'), {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'red'
            }));
            return;
        }

        const tags = await getAllTags();

        if (tags.length === 0) {
            const { createFirst } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'createFirst',
                    message: '是否要創建第一個 tag (v1.0.0)?',
                    default: true
                }
            ]);

            if (createFirst) {
                const spinner = ora('正在創建首個 tag...').start();
                const git = simpleGit();
                await git.addTag('v1.0.0');
                spinner.succeed('成功創建首個 tag: v1.0.0');
            }
            return;
        }

        const { selectedTag } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedTag',
                message: '請選擇一個 tag:',
                choices: tags
            }
        ]);

        const version = parseVersion(selectedTag);
        if (!version) {
            return;
        }

        const { updateType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'updateType',
                message: '請選擇要更新的版本級別：',
                choices: [
                    { name: '🐛 修復 (patch)', value: 'fix' },
                    { name: '✨ 功能 (minor)', value: 'mid' },
                    { name: '🚀 主要 (major)', value: 'main' }
                ]
            }
        ]);

        const newVersion = incrementVersion(version, updateType);
        const newVersionStr = newVersion.join('.');
        const newTag = selectedTag.replace(/[0-9]+\.[0-9]+\.[0-9]+/, newVersionStr);

        console.log(boxen(
            `${chalk.blue('當前版本:')} ${chalk.yellow(selectedTag)}\n` +
            `${chalk.blue('新版本:')} ${chalk.green(newTag)}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'cyan'
            }
        ));

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `確定要創建新的 tag 嗎？`,
                default: true
            }
        ]);

        if (confirm) {
            const spinner = ora('正在創建新的 tag...').start();
            const git = simpleGit();
            await git.addTag(newTag);
            spinner.succeed(`成功創建新的 tag: ${chalk.green(newTag)}`);
        } else {
            console.log(chalk.yellow('已取消創建'));
        }

    } catch (error) {
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
}

module.exports = { run };