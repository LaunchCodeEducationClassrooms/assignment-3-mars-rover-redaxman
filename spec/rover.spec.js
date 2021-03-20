const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');


describe("Rover class", function (){
  it("constructor sets position and default values for mode and generatorWatts", function () {
  let rover = new Rover(98382);
  expect(rover.position).toEqual(98382);
  expect(rover.mode).toEqual('NORMAL');
  expect(rover.generatorWatts).toEqual(110);
});
  it("response returned by receiveMessage contains name of message", function (){ 
  let rover = new Rover(98382);
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message('Hello', commands);
  let results = rover.receiveMessage(message);
  expect(results.message).toEqual('Hello')

});
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let rover = new Rover(98382);
     let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('test 9', commands);
    let response = rover.receiveMessage(message);
   expect(response.results.length).toEqual(commands.length)
  });
  it("responds correctly to status check command", function () {
    let rover = new Rover(98382);
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('NAME OF THE MESSAGE', commands);
    let actual = rover.receiveMessage(message).results[0];
    let expectedReturn = {
        completed: true,
        roverStatus: {
          position: 98382,
          mode: 'NORMAL',
          generatorWatts: 110
          }
        };
      expect(actual).toEqual(expectedReturn);
});
  it("responds correctly to mode change command", function (){
    let commands = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("mode change command", commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(rover.mode).toEqual('LOW_POWER');
    expect(response.results[0]).toEqual(({completed: true}))
  });
  it("responds with false completed value when attempting to move in 'LOW_POWER' mode", function() {
        let rover = new Rover(98382);
        let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 30)];
        let message = new Message("test message - move attempt for test 12", commands);
        let response = rover.receiveMessage(message);
        expect(rover.position).toEqual(98382);
        expect(rover.mode).toEqual('LOW_POWER');
        expect(response.results[1]).toEqual(({completed: false}));
        expect(response.results[0]).toEqual(({completed: true}));

  });
    it("responds with position for move command", function (){
      let commands = [new Command("MOVE", 150)];
      let message = new Message("test message for 13", commands);
      let rover = new Rover(98382);

      rover.receiveMessage(message);

      expect(rover.position).toEqual(150);
    });
  });

