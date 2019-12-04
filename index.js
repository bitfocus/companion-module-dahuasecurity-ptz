var instance_skel = require('../../instance_skel');
var request = require("request");
var tcp = require("../../tcp");
var EventEmitter = require('events').EventEmitter;
var debug;
var log;
var instance_speed = 1;

/**
 * Companion instance for Dahua / Amcrest PTZ cameras.
 * @author Bastiaan Rodenburg 
 */

class instance extends instance_skel {

	constructor(system, id, config) {
		super(system, id, config);
		var self = this;

		// Characterworks Port #
		self.actions();
		self.BASEURI = "";
	}

	actions(system) {
		var self = this;

		self.system.emit('instance_actions', self.id, {
			'left':           { label: 'Pan Left',
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' }, 
							{ id: '-1', label: 'Default speed' } 
						]
					}
				],
				default: '1'
			 },
			'right':          { label: 'Pan Right' ,
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' }, 
							{ id: '-1', label: 'Default speed' }  
						]
					}
				],
				default: '1'
			 },
			 'up':          { label: 'Tilt up' ,
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' }, 
							{ id: '-1', label: 'Default speed' }  
						]
					}
				],
				default: '1'
			},
			'down':          { label: 'Tilt down' ,
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' } , 
							{ id: '-1', label: 'Default speed' } 
						],
						default: '1'
					}
				]
			},
			'upleft':           { label: 'Pan Up/Left',
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' } , 
							{ id: '-1', label: 'Default speed' } 
						],
						default: '1'
					}
				]
				},
			'upright':          { label: 'Pan Up/Right' ,
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' } , 
							{ id: '-1', label: 'Default speed' } 
						],
						default: '1'
					}
				]
			},
			'downleft':           { label: 'Pan Down/Left',
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' } , 
							{ id: '-1', label: 'Default speed' } 
						],
						default: '1'
					}
				]
			},
			'downright':          { label: 'Pan Down/Right' ,
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' } , 
							{ id: '-1', label: 'Default speed' } 
						],
						default: '1'
					}
				]
			},
			'stop':           { label: 'PTZ Stop' },

			'zoomI':          { label: 'Zoom In' },
			'zoomO':          { label: 'Zoom Out' },
			'focusN':         { label: 'Focus Near' },
			'focusF':         { label: 'Focus Far' },
			'preset':          { label: 'Goto preset' ,
				options: [
					{
						type: 'textinput',
						width: 3,
						regex: self.REGEX_NUMBER,
						label: 'Preset #',
						id: 'preset'
					}
				]
			},
			'setDefaultSpeed':          { label: 'Set default speed' ,
				options: [
					{
						type: 'dropdown',
						label: 'Speed',
						id: 'speed',
						choices: [ 
							{ id: '1', label: '1 slow' }, 
							{ id: '2', label: '2' }, 
							{ id: '3', label: '3' }, 
							{ id: '4', label: '4' }, 
							{ id: '5', label: '5' }, 
							{ id: '6', label: '6' }, 
							{ id: '7', label: '7' }, 
							{ id: '8', label: '8 fast' } , 
						],
						default: '1'
					}
				]
			},
		});
	}

	ptzMove(direction,action,speed = 1) {
		var self = this;
	  
		if (speed == -1) {
			speed = self.instance_speed;
		}

		if (isNaN(speed)) {
			self.log('warn', 'INVALID PTZ SPEED');
		  	return 0;
		}

		if ((action !== 'start') && (action !== 'stop')) {
			self.log('warn', 'INVALID PTZ COMMAND!');
		  	return 0;
		}

		self.log('debug', action + ' to ' + direction);

		request(self.BASEURI + '/cgi-bin/ptz.cgi?action=' + action + '&channel=1&code=' + direction + '&arg1=' + speed +'&arg2=' + speed + '&arg3=0', function (error, response, body) {
    
			if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
				self.log('warn', 'Send Error: ' + error);
				// Start init to reconnect to cam because probably network lost
				self.init();
				
			}
		  }).auth(self.config.user,self.config.password,false);

	}
	  

	action(action) {
		var self = this;
		var  cmd;
		var action;
		var opt = action.options;

		switch (action.action) {

			case 'left':
				cmd = 'start';
				action = 'Left';
				self.ptzMove(action, cmd, opt.speed);
				break;

			case "right":
				cmd = 'start';
				action = 'Right';
				self.ptzMove(action, cmd, opt.speed);
				break;

			case 'up':
				cmd = 'start';
				action = 'Up';
				self.ptzMove(action, cmd, opt.speed);
				break;

			case "down":
				cmd = 'start';
				action = 'Down';
				self.ptzMove(action, cmd, opt.speed);
				break;
			case 'upleft':
				cmd = 'start';
				action = 'LeftUp';
				self.ptzMove(action, cmd, opt.speed);
				break;

			case "upright":
				cmd = 'start';
				action = 'RightUp';
				self.ptzMove(action, cmd, opt.speed);
				break;
			case 'downleft':
				cmd = 'start';
				action = 'LeftDown';
				self.ptzMove(action, cmd, opt.speed);
				break;

			case "downright":
				cmd = 'start';
				action = 'RightDown';
				self.ptzMove(action, cmd, opt.speed);
				break;
			
			case 'stop':
				cmd = 'stop';
				action = 'Left';
				self.ptzMove(action, cmd, 1);
				break;
			case 'zoomI':
				cmd = 'start';
				action = 'ZoomTele';
				self.ptzMove(action, cmd, 0);
				break;
			case 'zoomO':
				cmd = 'start';
				action = 'ZoomWide';
				self.ptzMove(action, cmd, 0);
				break;
			case 'focusN':
				cmd = 'start';
				action = 'FocusNear';
				self.ptzMove(action, cmd, 0);
				break;
			case 'focusF':
				cmd = 'start';
				action = 'FocusFar';
				self.ptzMove(action, cmd, 0);
				break;
			case 'preset':
				cmd = 'start';
				action = 'GotoPreset';
				self.ptzMove(action, cmd, opt.preset);
			case 'setDefaultSpeed':
				// Only speed of this instance, not send to camera
				self.instance_speed = opt.speed;
		}
	}

	// Web config fields
	config_fields () {
		var self = this;
		return [
			{
				type:    'textinput',
				id:      'host',
				label:   'Dahua Amcrest API IP Address',
				tooltip: 'The IP of the camera',
				width:   6,
				regex:   self.REGEX_IP
			},
			{
				type:    'textinput',
				id:      'port',
				label:   'Dahua Amcrest API Port Number (default 80)',
				tooltip: 'The Port Number camera.',
				width:   6,
				default: 80,
				regex: self.REGEX_PORT
			},
			{
				type:    'textinput',
				id:      'user',
				label:   'User name',
				tooltip: 'The user name.',
				width:   6,
				regex: self.REGEX_SOMETHING
			},
			{
				type:    'textinput',
				id:      'password',
				label:   'Password',
				tooltip: 'The password',
				width:   6,
				regex: self.REGEX_SOMETHING
			}
		]
	}


	destroy() {
		var self = this;
		debug("destroy");
	}

	init() {
		var self = this;

		debug = self.debug;
		log = self.log;
		self.instance_speed = 1;

		self.status(self.STATUS_WARNING, 'Connecting...');

		// Connecting on init not neccesary for http (request). But during init try to tcp connect
		// to get the status of the module right and automatically try reconnecting. Which is 
		// implemented in ../../tcp. 
		if (self.config.host !== undefined) {
			self.tcp = new tcp(self.config.host, self.config.port);

			self.tcp.on('status_change', function (status, message) {
				self.status(status, message);
			});

			self.tcp.on('error', function () {
				// Ignore
			});
			self.tcp.on('connect', function () {
				// disconnect immediately because further comm takes place via Request and not
				// via this tcp sockets.
				if (self.tcp !== undefined) {
					self.tcp.destroy();
				}
				delete self.tcp;
				self.BASEURI = 'http://' + self.config.host + ':' + self.config.port;

				//Try a ptz stop command to be sure username and password are correct and this user is allowed PTZ on this camera
				self.log('debug', 'Send stop command to camera to test');
				request(self.BASEURI + '/cgi-bin/ptz.cgi?action=stop&channel=1&code=Up&arg1=1&arg2=1&arg3=0', function (error, response, body) {
    
					if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
						self.status(self.STATUS_ERROR, 'Username/password');
						self.log('warn', "response.statusCode: " + response.statusCode);
						self.log('warn', "response.statusText: " + response.statusText);
					}
				  }).auth(self.config.user,self.config.password,false);
			});
		}
	}

	updateConfig(config) {
		var self = this;
		self.config = config;

		if (self.tcp !== undefined) {
			self.tcp.destroy();
			delete self.tcp;
		}

		self.init();
	}
}

exports = module.exports = instance;
