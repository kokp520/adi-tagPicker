// const simpleGit = require('simple-git');
// const ora = require('ora');
import simpleGit from 'simple-git';
import ora from 'ora';

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

async function createTag(tagName) {
    const spinner = ora('正在創建新的 tag...').start();
    const git = simpleGit();
    try {
        await git.addTag(tagName);
        spinner.succeed(`成功創建新的 tag: ${tagName}`);
    } catch (error) {
        spinner.fail('創建 tag 失敗');
        throw error;
    }
}

// module.exports = {
//     isGitRepo,
//     getAllTags,
//     createTag
// }; 

export {
    isGitRepo,
    getAllTags,
    createTag
}