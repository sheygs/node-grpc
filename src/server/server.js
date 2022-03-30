/* eslint-disable no-unused-vars */
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
const PROTO_PATH = '../proto/tasks.proto';
let tasks = require('./tasks');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const tasksProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(tasksProto.TasksService.service, {
  getAllTasks(_, cb) {
    cb(null, { tasks });
  },
  addTasks(call, cb) {
    console.log({ call });
    let taskObj = { ...call.request, id: Date.now() };
    tasks = [...tasks, taskObj];
    cb(null, taskObj);
  },
  editTasks(_, cb) {
    const _id = _.request.id;
    const taskItem = tasks.find(({ id }) => id === _id);
    if (!taskItem) return cb(null, 'News Item does not exist');
    taskItem.body = _.request.body;
    taskItem.title = _.request.title;
    cb(null, taskItem);
  },
});

let address = 'localhost:50051';

server.bindAsync(
  address,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log(`Server running at ${address}...`);
    server.start();
  }
);
