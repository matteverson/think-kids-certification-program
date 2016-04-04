/**
 * Broadcast updates to client when the model changes
 */

'use strict';

const Classes = require('./classes.model');

function onSave(socket, doc) {
  socket.emit('Classes:save', doc);
}

function onRemove(socket, doc) {
  socket.emit('Classes:remove', doc);
}

exports.register = socket => {
  Classes.schema.post('save', doc => {
    onSave(socket, doc);
  });
  Classes.schema.post('remove', doc => {
    onRemove(socket, doc);
  });
};
