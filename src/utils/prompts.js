import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

async function promptFirstTag() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'createFirst',
            message: 'Are you ready to create first tag (v1.0.0)?',
            default: true
        }
    ]);
}

async function fuzzySearchPrompt(tags) {
    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'selectedTag',
            message: 'Please enter tag name to search:',
            source: async (answersSoFar, input) => {
                if (!input) {
                    return Promise.resolve(tags);
                }
                
                const searchTerms = input.split(/\s+/);
                
                return Promise.resolve(tags.filter(tag => 
                    searchTerms.every(term => tag.includes(term))
                ));
            }
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
                { name: '🐛 patch (third)', value: 'fix' },
                { name: '✨ minor (second)', value: 'mid' },
                { name: '🚀 major (first)', value: 'main' }
            ]
        }
    ]);
}

async function promptConfirmation() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Are you ready to create new tag?`,
            default: true
        }
    ]);
}

export {
    promptFirstTag,
    // promptSelectTag,
    promptUpdateType,
    promptConfirmation,
    fuzzySearchPrompt
}