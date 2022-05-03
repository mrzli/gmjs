const { execSync } = require('child_process');

function runMany(argv) {
  const target = argv[2];
  const jobIndex = Number(argv[3]);
  const jobCount = Number(argv[4]);
  const base = argv[5];
  const head = argv[6];

  const debugOutput = {
    target,
    jobIndex,
    base,
    head,
  };

  console.log(JSON.stringify(argv));

  console.log(JSON.stringify(debugOutput, null, 2));

  const printAffectedCommand = `npx nx print-affected --base=${base} --head=${head} --target=${target}`;
  console.log(`printAffectedCommand: '${printAffectedCommand}'`);

  const affectedResult = execSync(printAffectedCommand).toString('utf-8');
  const affectedProjects = getAffectedProjects(affectedResult);

  const sliceSize = Math.max(Math.floor(affectedProjects.length / jobCount), 1);
  const projects =
    jobIndex < jobCount
      ? affectedProjects.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
      : affectedProjects.slice(sliceSize * (jobIndex - 1));

  console.log(`projects: ${JSON.stringify(projects)}`);

  if (projects.length > 0) {
    execSync(
      `npx nx run-many --target=${target} --projects=${projects} --parallel`,
      {
        stdio: [0, 1, 2],
      }
    );
  }
}

function getAffectedProjects(affectedResult) {
  return JSON.parse(affectedResult)
    .tasks.map((t) => t.target.project)
    .slice()
    .sort();
}

runMany(process.argv);
