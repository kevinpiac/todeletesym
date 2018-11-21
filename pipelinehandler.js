const lib = require('./lib');

const forEachJobAsync = async (jobs, i, io, config, prevResults) => {
  if (i >= jobs.length) {
    return Promise.resolve('ALL DONE');
  }
  const job = jobs[i];
  io.emit('log', `[${job.id}] Starting Job`);

  const inputData = { ...config, results: { ...prevResults } };
  const vm = lib.newVM(io);
  const res = await lib.runAsModule(vm, job.sourceCode, inputData);
  const mergeRes = { ...prevResults, [job.id]: res };
  io.emit('log', `[${job.id}] Done ! Result: [${res}]`);
  return forEachJobAsync(jobs, i + 1, io, config, mergeRes);
};

const execute = async (pipeline, io) => {
  const { jobs, config } = pipeline;

  await forEachJobAsync(jobs, 0, io, config, {});
  return Promise.resolve('ALL JOBS FINISHED');
};

module.exports = {
  execute,
};
