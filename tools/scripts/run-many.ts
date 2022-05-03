import { execSync } from 'child_process';

interface DebugOutput {
  readonly target: string;
  readonly jobIndex: number;
  readonly base: string;
  readonly head: string;
}

interface Task {
  readonly target: { readonly project: string; };
}

function runMany(argv: readonly string[]): void {
  const target: string = argv[2];
  const jobIndex: number = Number(argv[3]);
  const jobCount: number = Number(argv[4]);
  const base: string = argv[5];
  const head: string = argv[6];

  const debugOutput: DebugOutput = {
    target,
    jobIndex,
    base,
    head,
  };

  console.log(JSON.stringify(argv));

  console.log(JSON.stringify(debugOutput, null, 2));

  const printAffectedCommand = `npx nx print-affected --base=${base} --head=${head} --target=${target}`;
  console.log(`printAffectedCommand: '${printAffectedCommand}'`);

  const affectedResult: string = execSync(printAffectedCommand).toString('utf-8');
  const affectedProjects: readonly string[] = getAffectedProjects(affectedResult);

  const sliceSize: number = Math.max(Math.floor(affectedProjects.length / jobCount), 1);
  const projects: readonly string[] =
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

function getAffectedProjects(affectedResult: string): readonly string[] {
  return JSON.parse(affectedResult)
    .tasks.map((t: Task) => t.target.project)
    .slice()
    .sort();
}

runMany(process.argv);
