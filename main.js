var ApiKey = "NKRaCGtXiYUhyfa0yiPEm2aw4i7fmE_3";
var db = "price_match";
var collection = "Products"
var url = "https://api.mongolab.com/api/1/databases/" + db + "/collections/" + collection + "?apiKey=" + ApiKey;	

var Loading = {
	Show: function() {
		$(".blackLayout").show();
	},
	Hide: function() {
		$(".blackLayout").hide();
	}
};
var Search = {
	SearchVal: "",
	Search: function(){
		this.SearchVal = $("#q").val().toLowerCase();
		
		var mongoQuery = '&q={"Name": {"$regex":".*' + this.SearchVal + '.*"}}&s={"RelativePrice": 1}';
		
		url = "https://api.mongolab.com/api/1/databases/" + db + "/collections/" + collection + "?apiKey=" + ApiKey;	
		
		if (mongoQuery.length > 0) {
			url = url + mongoQuery;
		}
		
		$(".navbar-toggle").click()
		Loading.Show();
		$(".container").slideUp(500);
		
		$.ajax({
			url: url,
			// data: obj,
			success: function(data){
				var templateHTML = $(".container .row:first")[0].outerHTML;

				$(".container .row").each(function(i){
					if (i > 0) {
						$(this).remove();
					}
				});
				
				for (var p in data){
					$(".container").append(templateHTML);
				
					var prd = data[p];
					
					$(".container .row:last").attr("data-productid", prd.Id);
					$(".container .row:last span[name='Name']").html(prd.Name);
					$(".container .row:last span[name='Brand']").html(prd.Brand);
					$(".container .row:last span[name='RelativePrice']").html(prd.RelativePrice);
					$(".container .row:last span[name='PricePerPackage']").html(prd.PricePerPackage);
					$(".container .row:last span[name='AmountByPackage']").html(prd.AmountByPackage);
					$(".container .row:last span[name='RelativeType']").html(prd.RelativeType);
					$(".container .row:last span[name='StoreName']").html(prd.StoreName);
					var storeLocation = '<a target="_new" href="https://www.google.ca/maps?q=' + prd.StoreLocation + '">' + prd.StoreLocation + '</a>';
					$(".container .row:last span[name='StoreLocation']").html(storeLocation);
					$(".container .row:last span[name='VotesUp']").html(prd.VotesUp);
					$(".container .row:last span[name='VotesDown']").html(prd.VotesDown);
					$(".container .row:last img:first").attr("src", prd.Source);
				}
				
				Loading.Hide();
				$(".container").slideDown(500);
			},
			dataType: "json"
		});
	}
};
function InsertItem(){
	url = "https://api.mongolab.com/api/1/databases/" + db + "/collections/" + collection + "?apiKey=" + ApiKey;	
	var product = {};
	$(".container .row input").each(function(){
		if ($(this).attr("type") == "text"){
			var name = $(this).attr("name");
			var val = $.trim($(this).val().toLowerCase());
			product[name] = val;
		}
	});
	$(".container .row select").each(function(){
		var name = $(this).attr("name");
		var val = $.trim($(this).val().toLowerCase());
		product[name] = val;
	});
	product["Id"] = integerGuid();
	
	$.ajax({
		url: url,
		type: "POST",
		data: JSON.stringify(product),
		contentType: "application/json"
	}).done(function( msg ) {
		alert("Item is in.  Thanks!");
	});
}
$(document).ready(function(){
	$("#searchForm").submit(function(event){
		event.preventDefault();
		Search.Search();
	});
	$("#loginForm").submit(function(event){
		event.preventDefault();
		UserAccount.Login();
	});
	$("#insertForm").submit(function(event){
		event.preventDefault();
		InsertItem();
	});
	
	if (objCookies.IsExist(CONST_LOGGED_IN)){
		var data = JSON.parse(objCookies.Get(CONST_LOGGED_IN));
		UserAccount.MyItems = data.MyItems;
		UserAccount.Email = data.Email;
		UserAccount.Role = data.Role;
		UserAccount.RegisteredUserActions();
	}
});

var UserAccount = {
	Id: "XXX",
	Role: "None",
	Email: "XXX",
	MyItems: [],
	RegisteredUserActions: function() {
	console.log(UserAccount.Role);
		if (UserAccount.Role != "Admin" && UserAccount.Role != "Contributor") {
			// hide insert option
			$(".navbar-nav .dropdown-menu a:contains(Insert)").hide();
		}
	},
	Login:function(){
		var email = $("#email").val();
		
		if (email.length < 3) {
			alert("Please provide a valid email");
			return false;
		}
	
		var user = {
			Email: email
		};
		
		url = 'https://api.mongolab.com/api/1/databases/' + db + '/collections/Users?apiKey=' + ApiKey + '&q={"Email":"' + email + '"}';
		
		$.ajax({
			url: url,
			type: "GET",
			data: JSON.stringify(user),
			contentType: "application/json"
		}).done(function( data ) {
			if (data != null && data[0] != null) {
				// UserAccount.Id = data[0].Id;
				if (data[0].MyItems == "") {
					UserAccount.MyItems = [];
				} else {
					UserAccount.MyItems = data[0].MyItems.split(',');
				}
				
				UserAccount.Email = data[0].Email;
				UserAccount.Role = data[0].Role;
				
				objCookies.Create("LoggedIn", JSON.stringify(UserAccount), 360);
				setTimeout(function(){ BaseActions.VerifyLogin(); }, 150);
				return;
			}
			
			url = "https://api.mongolab.com/api/1/databases/" + db + "/collections/Users?apiKey=" + ApiKey;	
			var user = {
				Email: email,
				MyItems: ""
			};
			$.ajax({
				url: url,
				type: "POST",
				data: JSON.stringify(user),
				contentType: "application/json"
			}).done(function( msg ) {
				UserAccount.Email = data.Email;
				objCookies.Create("LoggedIn", JSON.stringify(UserAccount), 360);
				setTimeout(function(){ BaseActions.VerifyLogin(); }, 150);
			});
		});
	},
	AddItem: function(obj) {
		var email = JSON.parse(objCookies.Get(CONST_LOGGED_IN)).Email;
		url = 'https://api.mongolab.com/api/1/databases/' + db + '/collections/Users?apiKey=' + ApiKey + '&q={"Email":"' + email + '"}';
		
		var itemId = $(obj).closest(".row").data().productid;
		if (itemId.toString().length > 0) {
			UserAccount.MyItems.push(itemId);
		} else {
			alert("Cannot add item.");
			return false;
		}
		
		$.ajax({
			url: url,
			type: "PUT",
			data: JSON.stringify({ "$set" : { "MyItems" : UserAccount.MyItems.join(',') } }),
			contentType: "application/json"
		}).done(function( data ) {
			objCookies.Create("LoggedIn", JSON.stringify(UserAccount), 360);
			setTimeout(function(){ BaseActions.VerifyLogin(); }, 150);
		});
	},
	LoadMyItems: function(){
		var mongoQuery = '&q={"Id": {"$in": [' + UserAccount.MyItems.join(',') + ']}}';
		url = "https://api.mongolab.com/api/1/databases/" + db + "/collections/" + collection + "?apiKey=" + ApiKey;	
		
		if (UserAccount.MyItems.length > 0 && mongoQuery.length > 0) {
			url = url + mongoQuery;
		} else {
			alert("No saved items.");
			return;
		}
		
		Loading.Show();
		$(".container").slideUp(500);
		
		$.ajax({
			url: url,
			type: "GET",
			contentType: "application/json"
		}).done(function( data ) {
			$(".container").slideUp(500);

			$(".container .row").each(function(i){
				if (i > 0) {
					$(this).remove();
				}
			});
			var templateHTML = $(".container .row:first")[0].outerHTML;
			for (var p in data){
				$(".container").append(templateHTML);
			
				var prd = data[p];
				
				$(".container .row:last").attr("data-productid", prd.Id);
				$(".container .row:last span[name='Name']").html(prd.Name);
				$(".container .row:last span[name='Brand']").html(prd.Brand);
				$(".container .row:last span[name='RelativePrice']").html(prd.RelativePrice);
				$(".container .row:last span[name='PricePerPackage']").html(prd.PricePerPackage);
				$(".container .row:last span[name='AmountByPackage']").html(prd.AmountByPackage);
				$(".container .row:last span[name='RelativeType']").html(prd.RelativeType);
				$(".container .row:last span[name='StoreName']").html(prd.StoreName);
				var storeLocation = '<a target="_new" href="https://www.google.ca/maps?q=' + prd.StoreLocation + '">' + prd.StoreLocation + '</a>';
				$(".container .row:last span[name='StoreLocation']").html(storeLocation);
				$(".container .row:last span[name='VotesUp']").html(prd.VotesUp);
				$(".container .row:last span[name='VotesDown']").html(prd.VotesDown);
				$(".container .row:last img:first").attr("src", prd.Source);
				
				$(".container .row:last .resultsHeader span:first").remove();
			}
			
			Loading.Hide();
			$(".container").slideDown(500);
		});
/*
		$.ajax({
			url: url,
			// data: obj,
			success: function(data){
				var templateHTML = $(".container .row:first")[0].outerHTML;
				
				Loading.Show();
				
				$(".container").slideUp(500);

				$(".container .row").each(function(i){
					if (i > 0) {
						$(this).remove();
					}
				});
				
				for (var p in data){
					$(".container").append(templateHTML);
				
					var prd = data[p];
					
					$(".container .row:last").attr("data-productid", prd.Id);
					$(".container .row:last span[name='Name']").html(prd.Name);
					$(".container .row:last span[name='Brand']").html(prd.Brand);
					$(".container .row:last span[name='RelativePrice']").html(prd.RelativePrice);
					$(".container .row:last span[name='PricePerPackage']").html(prd.PricePerPackage);
					$(".container .row:last span[name='AmountByPackage']").html(prd.AmountByPackage);
					$(".container .row:last span[name='RelativeType']").html(prd.RelativeType);
					$(".container .row:last span[name='StoreName']").html(prd.StoreName);
					var storeLocation = '<a target="_new" href="https://www.google.ca/maps?q=' + prd.StoreLocation + '">' + prd.StoreLocation + '</a>';
					$(".container .row:last span[name='StoreLocation']").html(storeLocation);
					$(".container .row:last span[name='VotesUp']").html(prd.VotesUp);
					$(".container .row:last span[name='VotesDown']").html(prd.VotesDown);
					$(".container .row:last img:first").attr("src", prd.Source);
				}
				
				Loading.Hide();
				$(".container").slideDown(500);
			},
			dataType: "json"
		});
		*/
	}
};
function integerGuid() {
	return ((new Date().getUTCMilliseconds()) - ( Math.floor(Math.random() * (5000 - (-5000))) + -5000));
}