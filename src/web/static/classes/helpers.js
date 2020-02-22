
function parseCommands(stroke) {
  if (!stroke || !stroke.body) {
    return [];
  }
  const commands = [];
  var lines = stroke.body.split('\n');
  lines.forEach(line => {
    switch (true) {
    case !!line.match(/(up).*/):
      commands.push({
        type: 'up'
      });
      break;
    case !!line.match(/(down).*/):
      commands.push({
        type: 'down'
      });
      break;
    case !!line.match(/(to).*/):
      const coords = line.split(' ');
      commands.push({
        type: 'to',
        x: parseInt(coords[1]),
        y: parseInt(coords[2])
      });
      break;

    }
  });
  return commands;
}