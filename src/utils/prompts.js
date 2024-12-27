const inquirer = require('inquirer');
const chalk = require('chalk');

async function promptFirstTag() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'createFirst',
            message: '是否要創建第一個 tag (v1.0.0)?',
            default: true
        }
    ]);
}

async function promptSelectTag(tags) {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTag',
            message: '請選擇一個 tag:',
            choices: tags
        }
    ]);
}

async function promptUpdateType() {
    return inquirer.prompt([
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
}

async function promptConfirmation() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `確定要創建新的 tag 嗎？`,
            default: true
        }
    ]);
}

module.exports = {
    promptFirstTag,
    promptSelectTag,
    promptUpdateType,
    promptConfirmation
}; 