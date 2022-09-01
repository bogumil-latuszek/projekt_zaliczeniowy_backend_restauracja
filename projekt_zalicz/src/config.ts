import * as fs from 'fs';
import path from 'path';

// fs.readFileSync resolves file path relative to current working directory
// const config_file_content = fs.readFileSync(".config.json", 'utf-8');

// but we want to resolve starting from this file location:
const config_file_content = fs.readFileSync(path.resolve(__dirname, '../.config.json'), 'utf-8');
const config = JSON.parse(config_file_content)
export default config;
