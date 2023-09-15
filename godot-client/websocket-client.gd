extends Node

@onready var label = $Label

var socket = WebSocketPeer.new()
var connected = false

func _ready():
	socket.connect_to_url("ws://127.0.0.1:9876")

func _process(_delta):
	socket.poll()
	var state = socket.get_ready_state()
	
	if state == WebSocketPeer.STATE_OPEN:
		if(!connected):
			connected = true;
			socket.send_text("Godot client connected!")
		
		while socket.get_available_packet_count():			
			var data_json_str = socket.get_packet().get_string_from_utf8()
			if(data_json_str != null and data_json_str.length() > 0):
				var data = JSON.parse_string(data_json_str)
				if(data != null):
					print("Player Id = " + data.id)
					label.text = "Player Id = " + data.id

	elif state == WebSocketPeer.STATE_CLOSED:
		connected = false
