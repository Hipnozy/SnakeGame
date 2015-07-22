var EDir = {
    escape: 13
	, space: 32
	, left: 37
	, up: 38
	, right: 39
	, down: 40
    , w: 87
    , a: 65
    , s: 83
    , d: 68
};

function KeyInput(){}

KeyInput.lastCursor = 1;
KeyInput.lastDirection = EDir.right;

KeyInput.startListening = function() {
    window.onkeydown = function(e) {
        var keyCode = e.which ? e.which : e.keyCode;
        if (KeyInput.lastDirection === 1 || KeyInput.lastDirection === -1) {
            switch (keyCode) {
                case EDir.up:
                case EDir.w:
                    KeyInput.lastCursor = -20;
                    break;
                case EDir.down:
                case EDir.s:
                    KeyInput.lastCursor = 20;
                    break;
                default:
                    return;
            }
        } else if(KeyInput.lastDirection === 20 || KeyInput.lastDirection === -20) {
            switch (keyCode) {
                case EDir.right:
                case EDir.d:
                    KeyInput.lastCursor = 1;
                    break;
                case EDir.left:
                case EDir.a:
                    KeyInput.lastCursor = -1;
                    break;
                default:
                    return;
            }
        }
	};
};

KeyInput.getLastCursor = function(id) {
	var dir = KeyInput.lastCursor;

	if (id % 20 === 0 && dir === 1)
		dir = -19;
	else if ((id -1) % 20 === 0 && dir === -1)
		dir = 19;
	else if (id <= 20 && dir === -20)
		dir = 380;
	else if (id > 380 && dir === 20)
		dir = -380;

	KeyInput.lastDirection = KeyInput.lastCursor;

	return id + dir;
};