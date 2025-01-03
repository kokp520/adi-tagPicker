import chalk from 'chalk';
import boxen from 'boxen';

import { showTitle, showError, showVersionComparison } from './utils/display.js';
import { isGitRepo, getAllTags, createTag } from './utils/git.js';
import { parseVersion, incrementVersion } from './utils/version.js';
import { 
    promptFirstTag, 
    promptUpdateType, 
    promptConfirmation,
    fuzzySearchPrompt
} from './utils/prompts.js';

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
            const { createFirst } = await promptFirstTag();
            if (createFirst) {
                await createTag('v1.0.0');
            }
            return;
        }

        const { selectedTag } = await fuzzySearchPrompt(tags);
        const version = parseVersion(selectedTag);
        if (!version) {
            return;
        }

        const { updateType } = await promptUpdateType();
        const newVersion = incrementVersion(version, updateType);
        const newVersionStr = newVersion.join('.');
        const newTag = selectedTag.replace(/[0-9]+\.[0-9]+\.[0-9]+/, newVersionStr);

        showVersionComparison(selectedTag, newTag);

        const { confirm } = await promptConfirmation();
        if (confirm) {
            await createTag(newTag);
        } else {
            console.log(chalk.yellow('已取消創建'));
        }

    } catch (error) {
        showError(error);
    }
}

export { run };
