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
		// if logged in
		// // if index - redirect to search
		// else
		// // if NOT index - redirect to index
	
		var isLoggedIn = objCookies.IsExist(CONST_LOGGED_IN);
		if (isLoggedIn) {
			if (window.location.href.toLowerCase().indexOf("index") > -1) {
				BaseActions.LoadIndex();
			}
		} else {
			if (window.location.href.toLowerCase().indexOf("index") == -1) {
				BaseActions.LoadIndex();
			}
		}
	},
	Logout: function(){
		objCookies.Delete(CONST_LOGGED_IN);
		BaseActions.LoadIndex();
	},
	LoadIndex: function(){
		$("#LinkNav a[name='index']").click();
	},
	LoadSearch: function(){
		$("#LinkNav a[name='search']").click();
	},
	LoadSearchHistory: function(){
		$("#LinkNav a[name='searchHistory']").click();
	},
	LoadInsert: function(){
		$("#LinkNav a[name='insert']").click();
	},
}

BaseActions.VerifyLogin();