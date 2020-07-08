#!/usr/bin/env node
const inquirer = require('inquirer');
const colors = require('colors');
const fs = require('fs');

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
    createDirectoryContents(templatePath, projectName);
    
    // check if package.json exists and install depencies
    if (fs.existsSync(`${templatePath}/package.json`)) {
      installDependencies(projectName);
    }

    // generate git repository
    installGit(projectName);

    console.log(`\n${projectName} created successfully.`.green.bold);
    console.log('Happy hacking!'.green.bold);
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
  const child_process = require('child_process');
  const npmInstall = 'npm i'
  child_process.execSync(`cd ${projectName} && ${npmInstall}`);
  // child_process.execSync(`cd ${projectName} && ${npmInstall}`,{stdio:[0,1,2]});
}

const installGit = (projectName) => {
  const child_process = require('child_process');
  const gitInit = 'git init';
  const gitAdd = 'git add .';
  const gitCommit = 'git commit -m "Initialize project using Generate Project Template"';
  child_process.execSync(`cd ${projectName} && ${gitInit} && ${gitAdd} && ${gitCommit}`);
}