#!/usr/bin/env node
const inquirer = require('inquirer');
const colors = require('colors');
const fs = require('fs');
const { exec, execSync } = require('child_process');

// read templates from package template folder
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];

// grab arguments from cli to be used as project name
const argument = process.argv[2];
const checkQuestions = (argument === undefined || argument === "") ? QUESTIONS : QUESTIONS[0];
// const projectName = (checkQuestions === QUESTIONS[0]) ? argument : answers['project-name'];

// current prompt directory
const CURR_DIR = process.cwd();

inquirer.prompt(checkQuestions)
  .then(answers => {
    const projectChoice = answers['project-choice'];
    const projectName = (checkQuestions === QUESTIONS[0]) ? argument : answers['project-name'];
    const templatePath = `${__dirname}/templates/${projectChoice}`;
    
    // create template directory
    fs.mkdirSync(`${CURR_DIR}/${projectName}`);
    
    // create template content
    console.log('\nGenerating project...'.yellow.bold);
    createDirectoryContents(templatePath, projectName);

    // check if package.json exists
    if (fs.existsSync(`${templatePath}/package.json`)) {
      installDependencies(projectName);
    }

    installGit(projectName);
    
    console.log('Done.'.cyan.bold);
  })
  .catch(err => {
    console.log(err);
  });

function createDirectoryContents (templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
      
      // in case npm changes .gitignore to .npmignore
      if (file === '.npmignore') file = '.gitignore';

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');

    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
      
      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}

const installDependencies = (projectName) => {
  execSync(`cd ${projectName} && npm install --silent`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`.red.bold);
      return;
    }
    // console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
  });
}

const installGit = (projectName) => {
  const gitInit = 'git init';
  const gitAdd = 'git add .';
  const gitCommit = 'git commit -m "Initialize project using Create App Template"';

  execSync(`cd ${projectName} && ${gitInit} && ${gitAdd} && ${gitCommit}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    // console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
  });
}