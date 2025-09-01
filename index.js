const { InstanceBase, Regex, TCPHelper, runEntrypoint } = require('@companion-module/base')
const request = require('request')
const DEFAULT_INSTANCE_SPEED = 1

/**
 * Companion instance for Dahua / Amcrest PTZ cameras.
 * @author Bastiaan Rodenburg
 */

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		var self = this

		self.BASEURI = ''
	}

	actions() {
		var self = this

		self.setActionDefinitions({
			left: {
				name: 'Pan Left',
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
							{ id: '-1', label: 'Default speed' },
						],
					},
				],
				default: '1',
				callback: ({ options }) => self.ptzMove('Left', 'start', options.speed),
			},
			right: {
				name: 'Pan Right',
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
							{ id: '-1', label: 'Default speed' },
						],
					},
				],
				default: '1',
				callback: ({ options }) => self.ptzMove('Right', 'start', options.speed),
			},
			up: {
				name: 'Tilt up',
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
							{ id: '-1', label: 'Default speed' },
						],
					},
				],
				default: '1',
				callback: ({ options }) => self.ptzMove('Up', 'start', options.speed),
			},
			down: {
				name: 'Tilt down',
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
							{ id: '-1', label: 'Default speed' },
						],
						default: '1',
					},
				],
				callback: ({ options }) => self.ptzMove('Down', 'start', options.speed),
			},
			upleft: {
				name: 'Pan Up/Left',
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
							{ id: '-1', label: 'Default speed' },
						],
						default: '1',
					},
				],
				callback: ({ options }) => self.ptzMove('LeftUp', 'start', options.speed),
			},
			upright: {
				name: 'Pan Up/Right',
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
							{ id: '-1', label: 'Default speed' },
						],
						default: '1',
					},
				],
				callback: ({ options }) => self.ptzMove('RightUp', 'start', options.speed),
			},
			downleft: {
				name: 'Pan Down/Left',
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
							{ id: '-1', label: 'Default speed' },
						],
						default: '1',
					},
				],
				callback: ({ options }) => self.ptzMove('LeftDown', 'start', options.speed),
			},
			downright: {
				name: 'Pan Down/Right',
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
							{ id: '-1', label: 'Default speed' },
						],
						default: '1',
					},
				],
				callback: ({ options }) => self.ptzMove('RightDown', 'start', options.speed),
			},
			stop: { name: 'PTZ Stop', options: [], callback: () => self.ptzMove('Left', 'stop', 1) },
			zoomI: { name: 'Zoom In', options: [], callback: () => self.ptzMove('ZoomTele', 'start', 0) },
			zoomO: { name: 'Zoom Out', options: [], callback: () => self.ptzMove('ZoomWide', 'start', 0) },
			focusN: { name: 'Focus Near', options: [], callback: () => self.ptzMove('FocusNear', 'start', 0) },
			focusF: { name: 'Focus Far', options: [], callback: () => self.ptzMove('FocusFar', 'start', 0) },
			preset: {
				name: 'Goto preset',
				options: [
					{
						type: 'textinput',
						width: 3,
						regex: Regex.NUMBER,
						label: 'Preset #',
						id: 'preset',
					},
				],
				callback: ({ options }) => self.ptzMove('GotoPreset', 'start', options.preset),
			},
			setDefaultSpeed: {
				name: 'Set default speed',
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
						],
						default: '1',
					},
				],
				callback: ({ options }) => {
					self.instance_speed = options.speed
				},
			},
		})
	}

	ptzMove(direction, action, speed = 1) {
		var self = this

		if (speed == -1) {
			speed = self.instance_speed
		}

		if (isNaN(speed)) {
			self.log('warn', 'INVALID PTZ SPEED')
			return 0
		}

		if (action !== 'start' && action !== 'stop') {
			self.log('warn', 'INVALID PTZ COMMAND!')
			return 0
		}
		var uri = self.BASEURI + '/cgi-bin/ptz.cgi?action=' + action + '&channel=1'

		if (direction == 'GotoPreset') {
			uri += '&code=' + direction + '&arg1=0&arg2=' + speed + '&arg3=0'
		} else {
			uri += '&code=' + direction + '&arg1=' + speed + '&arg2=' + speed + '&arg3=0'
		}

		//self.log('debug', uri);

		request(uri, function (error, response, body) {
			if (error || response.statusCode !== 200 || body.trim() !== 'OK') {
				self.log('warn', 'Send Error: ' + error)
				// Start init to reconnect to cam because probably network lost
				self.init()
			}
		}).auth(self.config.user, self.config.password, false)
	}

	// Web config fields
	getConfigFields() {
		var self = this
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Dahua Amcrest API IP Address',
				tooltip: 'The IP of the camera',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Dahua Amcrest API Port Number (default 80)',
				tooltip: 'The Port Number camera.',
				width: 6,
				default: 80,
				regex: Regex.PORT,
			},
			{
				type: 'textinput',
				id: 'user',
				label: 'User name',
				tooltip: 'The user name.',
				width: 6,
				regex: Regex.SOMETHING,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				tooltip: 'The password',
				width: 6,
				regex: Regex.SOMETHING,
			},
		]
	}

	async destroy() {
		var self = this
		self.log('debug', 'destroy')
	}

	async init(config) {
		var self = this

		if (config) {
			self.config = config
		}

		self.instance_speed = DEFAULT_INSTANCE_SPEED

		self.actions()

		self.updateStatus('connecting')

		// Connecting on init not neccesary for http (request). But during init try to tcp connect
		// to get the status of the module right and automatically try reconnecting. Which is
		// implemented in TCPHelper.
		if (self.config.host !== undefined) {
			self.tcp = new TCPHelper(self.config.host, self.config.port)

			self.tcp.on('status_change', self.updateStatus.bind(self))

			self.tcp.on('error', function () {
				self.updateStatus('unknown_error')
			})
			self.tcp.on('connect', function () {
				// disconnect immediately because further comm takes place via Request and not
				// via this tcp sockets.
				if (self.tcp !== undefined) {
					self.tcp.destroy()
				}
				delete self.tcp
				self.BASEURI = 'http://' + self.config.host + ':' + self.config.port

				//Try a ptz stop command to be sure username and password are correct and this user is allowed PTZ on this camera
				request(
					self.BASEURI + '/cgi-bin/ptz.cgi?action=stop&channel=1&code=Up&arg1=1&arg2=1&arg3=0',
					function (error, response, body) {
						if (error || response.statusCode !== 200 || body.trim() !== 'OK') {
							self.updateStatus(
								'connection_failure',
								'Failed to connect to the camera... are the username and password correct? Status Code: ' +
									response.statusCode,
							)
						} else {
							self.updateStatus('ok')
						}
					},
				).auth(self.config.user, self.config.password, false)
			})
		}
	}

	async configUpdated(config) {
		var self = this
		self.config = config

		if (self.tcp !== undefined) {
			self.tcp.destroy()
			delete self.tcp
		}

		self.init()
	}
}

runEntrypoint(ModuleInstance, [])
