var CONST_LOGGED_IN = "LoggedIn1";

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

var BaseActions = {
	VerifyLogin: function() {		
		// if not a valid (html) page - redirect to index
		
		// if logged in
		// // if index - redirect to search
		// else
		// // if NOT index - redirect to index
	
		if (window.location.href.toLowerCase().indexOf("html") == -1) {
			BaseActions.LoadLogin();
		}
	
		var isLoggedIn = objCookies.IsExist(CONST_LOGGED_IN);
		if (isLoggedIn) {
			if (window.location.href.toLowerCase().indexOf("index") > -1 || 
			window.location.href.toLowerCase().indexOf("login") > -1) {
				BaseActions.LoadSearch();
			}
		} else {
			if (window.location.href.toLowerCase().indexOf("login") == -1) {
				BaseActions.LoadLogin();
			}
		}
	},
	Logout: function(){
		objCookies.Delete(CONST_LOGGED_IN);
		BaseActions.LoadLogin();
	},
	LoadIndex: function(){
		window.location.href = $("#LinkNav a[name='index']").attr("href");
	},
	LoadSearch: function(){
		window.location.href = $("#LinkNav a[name='search']").attr("href");
	},
	LoadSearchHistory: function(){
		window.location.href = $("#LinkNav a[name='searchHistory']").attr("href");
	},
	LoadInsert: function(){
		window.location.href = $("#LinkNav a[name='insert']").attr("href");
	},
	LoadLogin: function(){
		window.location.href = $("#LinkNav a[name='login']").attr("href");
	}
}

BaseActions.VerifyLogin();