const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const chalk = require('chalk');

async function isGitRepo() {
    const git = simpleGit();
    try {
        await git.revparse(['--git-dir']);
        return true;
    } catch (error) {
        return false;
    }
}

async function getAllTags() {
    const git = simpleGit();
    try {
        console.log(chalk.blue('正在獲取 Git tags...'));
        const { all: tags } = await git.tags();
        return tags.sort((a, b) => {
            return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
        });
    } catch (error) {
        throw new Error('獲取 tags 失敗');
    }
}

function parseVersion(tag) {
    console.log(chalk.blue(`正在解析 tag: ${tag}`));
    const versionMatch = tag.match(/[0-9]+\.[0-9]+\.[0-9]+/);
    if (!versionMatch) {
        console.log(chalk.yellow(`警告: tag "${tag}" 不符合版本號格式 (x.y.z)`));
        return null;
    }
    
    const version = versionMatch[0];
    const parts = version.split('.').map(Number);
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
        console.log(chalk.green('=== Git Tag 管理工具 ==='));
        
        // 檢查是否在 Git 倉庫中
        if (!await isGitRepo()) {
            console.log(chalk.red('錯誤: 當前目錄不是 Git 倉庫'));
            console.log(chalk.yellow('請在 Git 倉庫目錄下執行此命令'));
            return;
        }

        // 獲取所有 tags
        const tags = await getAllTags();

        if (tags.length === 0) {
            console.log(chalk.yellow('提示: 目前倉庫中沒有任何 tag'));
            const { createFirst } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'createFirst',
                    message: '是否要創建第一個 tag (1.0.0)?',
                    default: true
                }
            ]);

            if (createFirst) {
                const git = simpleGit();
                await git.addTag('1.0.0');
                console.log(chalk.green('✓ 成功創建首個 tag: 1.0.0'));
            }
            return;
        }

        console.log(chalk.blue(`找到 ${tags.length} 個 tags`));

        // 選擇 tag
        const { selectedTag } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedTag',
                message: '請選擇一個 tag:',
                choices: tags
            }
        ]);

        // 解析版本號
        const version = parseVersion(selectedTag);
        if (!version) {
            console.log(chalk.red('錯誤: 無法解析版本號'));
            return;
        }

        // 選擇更新類型
        const { updateType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'updateType',
                message: '請選擇要更新的版本級別：',
                choices: [
                    { name: '修復 (patch)', value: 'fix' },
                    { name: '功能 (minor)', value: 'mid' },
                    { name: '主要 (major)', value: 'main' }
                ]
            }
        ]);

        // 計算新版本號
        const newVersion = incrementVersion(version, updateType);
        const newVersionStr = newVersion.join('.');
        const newTag = selectedTag.replace(/[0-9]+\.[0-9]+\.[0-9]+/, newVersionStr);

        // 確認創建
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `確定要創建新的 tag ${chalk.green(newTag)} 嗎？`,
                default: true
            }
        ]);

        if (confirm) {
            const git = simpleGit();
            await git.addTag(newTag);
            console.log(chalk.green(`✓ 成功創建新的 tag: ${newTag}`));
        } else {
            console.log(chalk.yellow('已取消創建'));
        }

    } catch (error) {
        console.error(chalk.red('發生錯誤：'), error.message);
        console.error(chalk.gray('詳細錯誤：'), error);
    }
}

module.exports = { run };