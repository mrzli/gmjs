'use strict';
exports.__esModule = true;
var child_process_1 = require('child_process');
function runMany(argv) {
  var target = argv[2];
  var jobIndex = Number(argv[3]);
  var jobCount = Number(argv[4]);
  var base = argv[5];
  var head = argv[6];
  var debugOutput = {
    target: target,
    jobIndex: jobIndex,
    base: base,
    head: head,
  };
  console.log(JSON.stringify(argv));
  console.log(JSON.stringify(debugOutput, null, 2));
  var printAffectedCommand = 'npx nx print-affected --base='
    .concat(base, ' --head=')
    .concat(head, ' --target=')
    .concat(target);
  console.log("printAffectedCommand: '".concat(printAffectedCommand, "'"));
  var affectedResult = (0, child_process_1.execSync)(
    printAffectedCommand
  ).toString('utf-8');
  var affectedProjects = getAffectedProjects(affectedResult);
  var sliceSize = Math.max(Math.floor(affectedProjects.length / jobCount), 1);
  var projects =
    jobIndex < jobCount
      ? affectedProjects.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
      : affectedProjects.slice(sliceSize * (jobIndex - 1));
  console.log('projects: '.concat(JSON.stringify(projects)));
  if (projects.length > 0) {
    (0, child_process_1.execSync)(
      'npx nx run-many --target='
        .concat(target, ' --projects=')
        .concat(projects, ' --parallel'),
      {
        stdio: [0, 1, 2],
      }
    );
  }
}
function getAffectedProjects(affectedResult) {
  return JSON.parse(affectedResult)
    .tasks.map(function (t) {
      return t.target.project;
    })
    .slice()
    .sort();
}
runMany(process.argv);
