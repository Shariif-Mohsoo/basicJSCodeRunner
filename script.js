#!/usr/bin/env node
/*
   BIG CHALLENGES
   1-) HOW CAN WE DETECT THE FILE CHANGES ?
        BUILT IN TOOL chokidar
   SOLUTION: npm i chokidar
   2-) HOW TO PROVIDE SOME HELP TO USERS OF OUR CLI TOOL?
       BUILT IN TOOL caporal
  SOLUTION: npm i caporal
   3-) HOW TO FIGURE OUT HOW TO EXECUTE SOME JS CODE FROM WITHIN JS PROGRAM?
  SOLUTION: use the standard library module 'child_process' to execute program.

  NOTE:
  MAKE SURE TO VISIT THE DOCUMENTATION OF ALL OF THESE TOOLS ON GOOGLE.
*/
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import program from "caporal";
import fs from "fs";
import chalk from "chalk";
import { spawn } from "child_process";
program
  .version("0.0.1")
  .argument("[filename]", "Name of a file to execute")
  .action(async (args) => {
    const { filename } = args;
    const name = filename || "index.js";
    try {
      //to check file exists or not.
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(chalk.red.bold(`Could not find the file ${name}`));
    }

    let proc;
    const start = debounce(() => {
      // console.log("Starting users program");
      if (proc) proc.kill();
      console.log(chalk.bgBlue.whiteBright.bold(">>>>>>> Starting Process.."));
      proc = spawn("node", [name], { stdio: "inherit" });
    }, 1000);
    chokidar
      .watch(process.cwd())
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

program.parse(process.argv);
