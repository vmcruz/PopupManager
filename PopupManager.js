var PopupManager = (function(window) {
	var _popups = {};
	return {
		create: function(url, name, w, h) {
			var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
			var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

			var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
			var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

			var left = ((width / 2) - (w / 2));
			var top = ((height / 2) - (h / 2));
			_popups[name] = {
								'url': url,
								'width': w,
								'height': h,
								'top': top,
								'left': left,
								'status': 'closed',
								'instance': undefined,
								'listeners': {}
							};
			return this.popup(name);
		},
		
		show: function(name) {
			var _self = this;
			if(_popups.hasOwnProperty(name)) {
				var popup = _popups[name];
				if(popup.status == 'closed') {
					var newWindow = window.open(popup.url, name, 'scrollbars=yes, width=' + popup.width + ', height=' + popup.height + ', top=' + popup.top + ', left=' + popup.left);
					if(!newWindow)
						throw new Error('No se han habilitado las popups para esta ventana');
					popup.status = 'opened';
					
					newWindow.addEventListener('beforeunload', function() {
						popup.status = 'closed';
					});
					
					newWindow.notify = function(event, data) {
						_self.notify(this, event, data);
					}
					
					popup.instance = newWindow;
					popup.instance.focus();
				} else
					popup.instance.focus();
				return true;
			}
			throw new Error('El nombre de la popup no existe');
		},
		
		list: function() {
			var l = [];
			for(var obj in _popups)
				l.push(_popups[obj]);
			return l;
		},
		
		popup: function(name) {
			if(_popups.hasOwnProperty(name)) {
				var retObject = _popups[name];
				retObject.attach = function(event, f) {
					if(typeof f === 'function' && typeof event === 'string') {
						if(!this.listeners.hasOwnProperty(event))
							this.listeners[event] = [];
						this.listeners[event].push(f);
						return true;
					}
					throw new Error('Los parámetros deben ser "string" y "function" respectivamente');
				};
				return retObject;
			}
			throw new Error('El nombre de la popup no existe');
		},
		
		notify: function(sender, event, data) {
			if(_popups.hasOwnProperty(sender.name)) {
				for(var i = 0; i < _popups[sender.name].listeners[event].length; i++)
					_popups[sender.name].listeners[event][i](data);
			} else
				throw new Error('El nombre de la popup no existe');
		}
	};
})(window);