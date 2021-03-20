const assert = require('assert');
const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');


describe("Rover class", function (){
  it("constructor sets position and default values for mode and generatorWatts", function () {
  let rover = new Rover(98382);
  assert.strictEqual(rover.position, 98382);
  assert.strictEqual(rover.mode, 'NORMAL');
  assert.strictEqual(rover.generatorWatts, 110)
});
  it("response returned by receiveMessage contains name of message", function (){ 
  let rover = new Rover(98382);
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message('NAME OF THE MESSAGE-TEST 8', commands);

  let results = rover.receiveMessage(message);
  assert.strictEqual(results.message, 'NAME OF THE MESSAGE-TEST 8');
});
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let rover = new Rover(98382);
     let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('test 9', commands);
    let response = rover.receiveMessage(message);
 
   assert.strictEqual(response.results.length, commands.length);
  });
  it("responds correctly to status check command", function () {
    let rover = new Rover(98382);
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('NAME OF THE MESSAGE', commands);
    let actual = rover.receiveMessage(message).results[0];
    let expected = {
        completed: true,
        roverStatus: {
          position: 98382,
          mode: 'NORMAL',
          generatorWatts: 110
          }
        };
      assert.deepEqual(actual, expected);
});
  it("responds correctly to mode change command", function (){
    let commands = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("mode change command", commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);

    assert.strictEqual(rover.mode, "LOW_POWER");
    assert.strictEqual(response.results[0]. completed, true);
  });
  it("responds with false completed value when attempting to move in 'LOW_POWER' mode", function() {
        let rover = new Rover(98382);
        let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 30)];
        let message = new Message("test message - move attempt for test 12", commands);
        let response = rover.receiveMessage(message);
        assert.strictEqual(rover.position, 98382);
        assert.strictEqual(rover.mode, "LOW_POWER");
        assert.strictEqual(response.results[1].completed, false);
        assert.strictEqual(response.results[0]. completed, true);
  });
    it("responds with position for move command", function (){
      let commands = [new Command("MOVE", 150)];
      let message = new Message("test message for 13", commands);
      let rover = new Rover(98382);

      rover.receiveMessage(message);
  
      assert.strictEqual(rover.position, 150);
    });
  });

