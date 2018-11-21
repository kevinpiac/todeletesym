const lib = require('./lib');

const forEachJobAsync = async (jobs, i, io) => {
  if (i >= jobs.length) {
    return Promise.resolve('ALL DONE');
  }
  const job = jobs[i];
  io.emit('log', `--> JOB ${job.id} <--`);

  const vm = lib.newVM(io);
  await lib.runAsModule(vm, 'console.log(`INPUT IS: ${inputData.inputObject}`)', { inputObject: true });

  io.emit('log', `<-- JOB ${job.id}`);
  return forEachJobAsync(jobs, i + 1, io);
};

const execute = async (pipeline, io) => {
  const { jobs } = pipeline;

  await forEachJobAsync(jobs, 0, io);
  return Promise.resolve('ALL DONE');
};

module.exports = {
  execute,
};
