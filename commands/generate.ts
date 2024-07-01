import { GluegunCommand } from 'gluegun';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const command: GluegunCommand = {
  name: 'generate',
  description: 'Generate resource files',
  run: async (toolbox) => {
    const {
      print: { info, success, error },
      prompt,
      strings,
    } = toolbox;

    // Prompt for resource name
    const { resourceName } = await prompt.ask({
      type: 'input',
      name: 'resourceName',
      message: 'Enter the resource name:',
      initial: 'Article',
      required: true,
    });

    const name = strings.pascalCase(resourceName); // UserAccount
    const singularNameUpperCase = strings.singular(name);
    const pluralizeNameUpperCase = strings.pluralize(name);
    const singularNameLowerCase = strings.camelCase(name);
    const pluralizeNameLowerCase = strings.camelCase(pluralizeNameUpperCase);

    // Prompt for file types to generate
    const { filesToGenerate } = await prompt.ask({
      type: 'multiselect',
      name: 'filesToGenerate',
      message: 'Select the files to generate (Use the spacebar to select):',
      choices: [
        'entity',
        'repository',
        'service',
        'controller',
        'route',
        'dto',
      ],
      required: true,
    });

    if (filesToGenerate.length === 0) {
      error('Please select at least one item to generate');
      return;
    }

    const stubDir = path.join(__dirname, '..', 'stubs');
    const outputDir = path.join(__dirname, '..', 'src');

    // Array to store the paths of generated files
    const generatedFiles: string[] = [];

    for (const fileType of filesToGenerate) {
      const stubPath = path.join(stubDir, `${fileType}.ts.stub`);
      const outputPath = path.join(
        outputDir,
        `${fileType}s`,
        `${singularNameLowerCase}.${fileType}.ts`,
      );

      try {
        let content = await fs.readFile(stubPath, 'utf-8');
        content = content
          .replace(/Article/g, singularNameUpperCase)
          .replace(/article/g, singularNameLowerCase)
          .replace(/Articles/g, pluralizeNameUpperCase)
          .replace(/articles/g, pluralizeNameLowerCase);

        await fs.outputFile(outputPath, content);
        generatedFiles.push(outputPath);
        success(`Generated ${outputPath}`);
      } catch (err) {
        error(`Error generating ${fileType}: ${err.message}`);
      }
    }

    // Run npm run lint:fix on the generated files
    try {
      const filesToLint = generatedFiles.join(' ');
      execSync(`npm run lint:fix:file -- -- ${filesToLint}`, {
        stdio: 'inherit',
      });
      success('Running lint fix on generated files...');
    } catch (error) {
      error('Error running lint:fix');
      console.error(error);
    }

    info('\nReminder:');
    info('- Create a migration file for the new entity.');
    info(`- Add the new route file to the index route (src/routes/index.ts).`);
  },
};

module.exports = command;
