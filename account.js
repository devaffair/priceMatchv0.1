var objCookies = {
	Create: function(name, val, days){
		var d = new Date();
		d.setTime(d.getTime() + (days * 24 * 60 * 60 *1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = name + "=" + val + "; " + expires;
	},
	Get: function(name){
		var name = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	},
	Delete: function(name) {
		objCookies.Create(name, "");
		objCookies.Create(name, "", 0);
	},
	IsExist: function(name){
		if (objCookies.Get(CONST_LOGGED_IN) == null) return false;
		if (objCookies.Get(CONST_LOGGED_IN).length > 0) return true;
		
		return false;
	}
};

var CONST_LOGGED_IN = "LoggedIn"

var BaseActions = {
	VerifyLogin: function() {
		var isLoggedIn = objCookies.IsExist(CONST_LOGGED_IN);
		var currentPath = window.location.href.split('/')[window.location.href.split('/').length-1];
		if (isLoggedIn) {
			if (currentPath == 'index.html') {
				window.location.href  = window.location.href.replace(currentPath, 'search.html');
			} else if (currentPath == "") {
				window.location.href  = window.location.href + '/search.html';
			}
		} else {
			if (currentPath != 'index.html') {
				window.location.href  = window.location.href.replace(currentPath, 'index.html');
			}
		}
	},
	Logout: function(){
		objCookies.Delete(CONST_LOGGED_IN);
		BaseActions.VerifyLogin();
	}
}
BaseActions.VerifyLogin();