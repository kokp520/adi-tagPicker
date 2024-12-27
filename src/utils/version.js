const ora = require('ora');

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

module.exports = {
    parseVersion,
    incrementVersion
}; 