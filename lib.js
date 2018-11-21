const { NodeVM, VMScript } = require('vm2');

// Init Node VM
const vmw = new NodeVM({
  console: 'redirect', // redirect the console, could be inherit to show directly...
  require: {
    external: true, // Enable usage of require();
    root: process.cwd(), // Set root path as current path.
  },
}).on('console.log', (msg, ...args) => { // we redirect console.log. We can do the same with console.info/error
  console.log('REDIRECTED_LOG -->', msg, ...args);
});

const asModuleScript = (codeString) => {
  return new VMScript(`
    module.exports = async (inputData) => {
    ${codeString}
  }`);
};

const runAsModule = async (vm, codeString, inputData) => {
  const script = asModuleScript(codeString);
  const p = await vm.run(script, 'script.js')(inputData);
  return p;
};

const newVM = (io) => {
  return new NodeVM({
    console: 'redirect', // redirect the console, could be inherit to show directly...
    require: {
      external: true, // Enable usage of require();
      root: process.cwd(), // Set root path as current path.
    },
  }).on('console.log', (msg, ...args) => { // we redirect console.log. We can do the same with console.info/error
    io.emit('log', `${msg} ${args}`);
  });
};


module.exports = {
  runAsModule,
  asModuleScript,
  newVM,
}
