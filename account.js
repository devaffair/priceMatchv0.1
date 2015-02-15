var CONST_LOGGED_IN = "LoggedIn";

var objCookies = {
	Create: function(name, val, days){
		alert("name: " + name);
		alert("val: " + val);
		alert("days: " + days);
		// $.cookie(val, name, { expires: days });
		$.cookie(name, val, { expires: days });
		return;
		var d = new Date();
		d.setTime(d.getTime() + (days * 24 * 60 * 60 *1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = name + "=" + val + "; " + expires;
	},
	Get: function(name){
		return $.cookie(name);
		
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
		$.removeCookie(name);
		return;
		objCookies.Create(name, "");
		objCookies.Create(name, "", 0);
	},
	IsExist: function(name){
		alert("account.js -> 33:" + $.cookie(name));
		return ($.cookie(name) != null &&$.cookie(name).length > 0);
		
		if (objCookies.Get(CONST_LOGGED_IN) == null) return false;
		if (objCookies.Get(CONST_LOGGED_IN).length > 0) return true;
		
		return false;
	}
};

var BaseActions = {
	VerifyLogin: function() {		
		window.location.href  = '/search.html';
		// don't do
		alert("account.js -> 43");
		var isLoggedIn = objCookies.IsExist(CONST_LOGGED_IN);
		var currentPath = window.location.href.split('/')[window.location.href.split('/').length-1];
		
		alert("IsLogged: " + isLoggedIn + "  ||  path:" + currentPath);
		
		if (currentPath.indexOf('/') == -1 && currentPath.indexOf('index.html') == -1) {
			alert("1: " + window.location.href);
			window.location.href  = '/index.html';
		}
		
		if (isLoggedIn) {
			alert("2: " + window.location.href);
			if (currentPath.inedxOf('index.html') > -1) {
				alert("3: " + window.location.href);
				window.location.href  = '/search.html';
			}
		} else {
			alert("4: " + window.location.href);
			if (currentPath.indexOf('index.html') == -1) {
				alert("5: " + window.location.href);
				window.location.href  = '/index.html';
			}
		}
	},
	Logout: function(){
		objCookies.Delete(CONST_LOGGED_IN);
		BaseActions.VerifyLogin();
	}
}
BaseActions.VerifyLogin();